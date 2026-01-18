import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import {
    detectDuplicate,
    detectDuplicatesInProposal,
    DEFAULT_CONFIG,
    type InvoiceData,
    type DetectionResult,
    type DetectionConfig,
} from '@/lib/duplicate-detection';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { invoices: invoicesToValidate, config: userConfig } = body;

        if (!Array.isArray(invoicesToValidate)) {
            return NextResponse.json(
                { error: 'Invalid request format. Expected { invoices: [...] }' },
                { status: 400 }
            );
        }

        // Merge user config with defaults
        const config: DetectionConfig = { ...DEFAULT_CONFIG, ...userConfig };

        const results: {
            invoice: InvoiceData;
            detection: DetectionResult | null;
            status: 'approved' | 'held' | 'review';
        }[] = [];

        // Check duplicates within the proposal first
        const proposalDuplicates = detectDuplicatesInProposal(
            invoicesToValidate as InvoiceData[],
            config
        );

        // Check each invoice against historical data
        for (let i = 0; i < invoicesToValidate.length; i++) {
            const invoice = invoicesToValidate[i] as InvoiceData;

            // Check for duplicates in the database
            const existingInvoices = await storage.findDuplicateInvoices(
                invoice.invoiceNumber,
                invoice.vendorId,
                String(invoice.amount)
            );

            let bestMatch: DetectionResult | null = null;

            // Compare with historical invoices
            for (const existing of existingInvoices) {
                const candidateInvoice: InvoiceData = {
                    id: existing.id,
                    invoiceNumber: existing.invoiceNumber,
                    vendorId: existing.vendorId,
                    amount: existing.amount,
                    invoiceDate: existing.invoiceDate,
                };

                const result = detectDuplicate(invoice, candidateInvoice, config);

                if (!bestMatch || result.score > bestMatch.score) {
                    bestMatch = result;
                }
            }

            // Also check proposal duplicates
            const proposalMatches = proposalDuplicates.get(i);
            if (proposalMatches) {
                for (const match of proposalMatches) {
                    if (!bestMatch || match.score > bestMatch.score) {
                        bestMatch = match;
                    }
                }
            }

            // Determine status based on detection result
            let status: 'approved' | 'held' | 'review' = 'approved';
            if (bestMatch) {
                if (bestMatch.autoHold) {
                    status = 'held';
                } else if (bestMatch.riskLevel === 'high' || bestMatch.riskLevel === 'medium') {
                    status = 'review';
                }
            }

            results.push({
                invoice,
                detection: bestMatch,
                status,
            });
        }

        // Summarize results
        const summary = {
            totalLines: results.length,
            approvedLines: results.filter(r => r.status === 'approved').length,
            heldLines: results.filter(r => r.status === 'held').length,
            reviewLines: results.filter(r => r.status === 'review').length,
            duplicatesDetected: results.filter(r => r.detection !== null).length,
        };

        // Separate duplicates by risk level
        const duplicates = results
            .filter(r => r.detection !== null)
            .map(r => ({
                ...r.invoice,
                status: r.status,
                score: r.detection!.score,
                riskLevel: r.detection!.riskLevel,
                autoHold: r.detection!.autoHold,
                signals: r.detection!.signals.filter(s => s.triggered),
                matchedWith: r.detection!.matchedInvoice,
            }));

        return NextResponse.json({
            ...summary,
            config,
            duplicates,
            approvedForPayment: results
                .filter(r => r.status === 'approved')
                .map(r => r.invoice),
            heldItems: results
                .filter(r => r.status === 'held')
                .map(r => ({
                    ...r.invoice,
                    detection: r.detection,
                })),
            reviewItems: results
                .filter(r => r.status === 'review')
                .map(r => ({
                    ...r.invoice,
                    detection: r.detection,
                })),
        });
    } catch (error) {
        console.error('Error validating payment gate:', error);
        return NextResponse.json(
            { error: 'Failed to validate payments' },
            { status: 500 }
        );
    }
}
