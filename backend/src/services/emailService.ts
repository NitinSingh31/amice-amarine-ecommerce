import crypto from 'crypto';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private fromEmail: string;

  constructor() {
    this.fromEmail = process.env.EMAIL_FROM || 'Amice Amarine Syndicate <dispatch@amiceamarine.com>';
  }

  public async sendEmail(options: EmailOptions): Promise<boolean> {
    const { to, subject, html, text } = options;

    // Check if an external email webhook or API key is provided
    if (process.env.RESEND_API_KEY) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: this.fromEmail,
            to,
            subject,
            html,
            text,
          }),
        });
        if (res.ok) {
          console.log(`[Email Service] Live email delivered to ${to} via Resend. Subject: ${subject}`);
          return true;
        }
      } catch (err: any) {
        console.warn('[Email Service] Resend dispatch failed, logging locally:', err.message);
      }
    }

    // Default Developer Sandbox / Console Simulation Logger
    console.log('\n======================================================');
    console.log(`⚡ [TRANSACTIONAL EMAIL DISPATCH // SIMULATED]`);
    console.log(`TO: ${to}`);
    console.log(`FROM: ${this.fromEmail}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`DATE: ${new Date().toISOString()}`);
    console.log('------------------------------------------------------');
    console.log(text || html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim());
    console.log('======================================================\n');

    return true;
  }

  public async sendOrderConfirmation(order: any): Promise<boolean> {
    const itemsList = order.items
      .map(
        (i: any) =>
          `• ${i.name} (Size: ${i.size}) x${i.quantity} — ₹${(i.price * i.quantity).toLocaleString('en-IN')}`
      )
      .join('\n');

    const subject = `[AMICE AMARINE] Order Confirmed: ${order.orderNumber} // Syndicate Dispatch`;

    const html = `
      <div style="background-color: #09090b; color: #f4f4f5; font-family: sans-serif; padding: 24px; max-width: 600px; margin: auto;">
        <h1 style="color: #ff003c; text-transform: uppercase; letter-spacing: 2px;">AMICE AMARINE</h1>
        <p style="color: #a1a1aa; font-size: 14px;">ORDER CONFIRMATION // CONSIGNMENT CODE: <strong>${order.orderNumber}</strong></p>
        <hr style="border-color: #27272a;" />
        <p>Thank you for securing your pieces, ${order.shippingAddress?.fullName}. Your order has entered our quality inspection pipeline.</p>
        <h3>Consignment Manifest:</h3>
        <pre style="background: #18181b; padding: 12px; color: #e4e4e7;">${itemsList}</pre>
        <p><strong>Total Amount: ₹${order.totalAmount.toLocaleString('en-IN')}</strong> (${order.paymentMethod.toUpperCase()})</p>
        <p>Shipping To: ${order.shippingAddress?.addressLine1}, ${order.shippingAddress?.city}, ${order.shippingAddress?.postalCode}</p>
        <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/tracking?order=${order.orderNumber}" style="color: #ff003c; font-weight: bold;">Track Satellite Radar</a></p>
      </div>
    `;

    const text = `
AMICE AMARINE // ORDER CONFIRMATION
Consignment: ${order.orderNumber}
Customer: ${order.shippingAddress?.fullName}

Items:
${itemsList}

Total: ₹${order.totalAmount.toLocaleString('en-IN')} (${order.paymentMethod.toUpperCase()})
Shipping to: ${order.shippingAddress?.addressLine1}, ${order.shippingAddress?.city} ${order.shippingAddress?.postalCode}

Track live at: ${(process.env.FRONTEND_URL || 'http://localhost:3000')}/tracking?order=${order.orderNumber}
    `;

    return this.sendEmail({ to: order.customerEmail, subject, html, text });
  }

  public async sendShippingUpdate(order: any): Promise<boolean> {
    const subject = `[AMICE AMARINE] Consignment Dispatched: ${order.orderNumber} (${order.courierPartner || 'Delhivery Express'})`;

    const html = `
      <div style="background-color: #09090b; color: #f4f4f5; font-family: sans-serif; padding: 24px; max-width: 600px; margin: auto;">
        <h1 style="color: #ff003c; text-transform: uppercase;">AMICE AMARINE</h1>
        <h2 style="color: #00f5ff;">CONSIGNMENT IN FLIGHT</h2>
        <p>Your order <strong>${order.orderNumber}</strong> has been handed to <strong>${order.courierPartner || 'Delhivery Express'}</strong>.</p>
        <p>Air Waybill (AWB): <strong style="color: #ffffff;">${order.trackingAwb || 'N/A'}</strong></p>
        <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/tracking?order=${order.orderNumber}" style="color: #ff003c; font-weight: bold;">View Live Satellite Milestones</a></p>
      </div>
    `;

    const text = `
AMICE AMARINE // DISPATCH ALERT
Order ${order.orderNumber} is now in flight with ${order.courierPartner || 'Delhivery Express'}.
Air Waybill (AWB): ${order.trackingAwb || 'N/A'}
Track at: ${(process.env.FRONTEND_URL || 'http://localhost:3000')}/tracking?order=${order.orderNumber}
    `;

    return this.sendEmail({ to: order.customerEmail, subject, html, text });
  }

  public async sendPasswordReset(email: string, resetUrl: string): Promise<boolean> {
    const subject = `[AMICE AMARINE] Security Clearance // Password Reset Request`;

    const html = `
      <div style="background-color: #09090b; color: #f4f4f5; font-family: sans-serif; padding: 24px; max-width: 600px; margin: auto;">
        <h1 style="color: #ff003c; text-transform: uppercase;">AMICE AMARINE</h1>
        <p style="color: #a1a1aa;">CREDENTIAL RESET REQUEST</p>
        <hr style="border-color: #27272a;" />
        <p>You requested a password reset for your syndicate account (${email}). This security clearance token expires in 60 minutes.</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="background-color: #ff003c; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">
            RESET PASSWORD
          </a>
        </p>
        <p style="font-size: 12px; color: #71717a;">If you did not request this, you can ignore this transmission.</p>
      </div>
    `;

    const text = `
AMICE AMARINE // PASSWORD RESET
Reset your credentials at the following link (valid for 60 minutes):
${resetUrl}
    `;

    return this.sendEmail({ to: email, subject, html, text });
  }
}

export const emailService = new EmailService();
