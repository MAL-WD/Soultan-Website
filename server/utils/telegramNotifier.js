/**
 * telegramNotifier.js
 * Sends a formatted Telegram notification when a new order is placed.
 * Uses the Telegram Bot API via fetch — no additional packages required.
 * Parse mode: HTML (more reliable than Markdown with Arabic text and special chars).
 */

const TELEGRAM_API_BASE = 'https://api.telegram.org';

/**
 * Escapes characters reserved in Telegram HTML mode.
 * @param {string} text
 * @returns {string}
 */
const escapeHtml = (text = '') =>
    String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

/**
 * Formats the list of ordered items into readable HTML lines with clickable product links.
 * @param {Array} items - Order items array
 * @returns {string}
 */
const formatItems = (items = []) => {
    const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');

    return items
        .map((item) => {
            const name      = escapeHtml(item.name_en || item.name_ar || 'Product');
            const qty       = item.quantity || 1;
            const price     = (item.price * qty).toLocaleString();
            const productId = item.product?.toString() || item._id?.toString();

            // Clickable product link so the manager can tap to see exactly which product it is
            const nameDisplay = productId
                ? `<b><a href="${clientUrl}/product/${productId}">${name}</a></b>`
                : `<b>${name}</b>`;

            return `  • ${nameDisplay} (x${qty}) — ${price} DZD`;
        })
        .join('\n');
};

/**
 * Maps payment method codes to human-readable labels.
 * @param {string} method
 * @returns {string}
 */
const formatPaymentMethod = (method) => {
    const methods = {
        cash_on_delivery: '💵 Cash on Delivery (الدفع عند الاستلام)',
        baridimob:        '📱 BaridiMob / CCP',
        dahabia:          '💳 Dahabia Card',
        ccp:              '🏦 CCP Transfer',
    };
    return escapeHtml(methods[method] || method || 'N/A');
};

/**
 * Sends a Telegram notification for a newly created order.
 * This function is fire-and-forget; errors are logged but never thrown.
 *
 * @param {Object} order - The saved Mongoose Order document
 */
export const sendTelegramOrderNotification = async (order) => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId   = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId || botToken === 'your-bot-token-here' || chatId === 'your-chat-id-here') {
        console.warn('[Telegram] Bot token or chat ID not configured. Skipping notification.');
        return;
    }

    try {
        const addr    = order.shippingAddress || {};
        const name    = escapeHtml(addr.name    || 'N/A');
        const phone   = escapeHtml(addr.phone   || 'N/A');
        const street  = escapeHtml(addr.street  || addr.address || 'N/A');
        const city    = escapeHtml(addr.city    || '');
        const address = city ? `${street}, ${city}` : street;

        const itemsText = formatItems(order.items);
        const total     = (order.totalAmount || 0).toLocaleString();
        const payment   = formatPaymentMethod(order.paymentMethod);
        const notes     = order.notes
            ? `\n📝 <b>ملاحظات / Notes:</b> ${escapeHtml(order.notes)}`
            : '';
        const orderId   = order._id?.toString().slice(-6).toUpperCase() || '??????';
        const timestamp = new Date().toLocaleString('fr-DZ', {
            timeZone:  'Africa/Algiers',
            dateStyle: 'short',
            timeStyle: 'short',
        });

        const message = [
            `🛍️ <b>طلب جديد / New Order</b> #${orderId}`,
            ``,
            `👤 <b>الاسم / Name:</b> ${name}`,
            `📞 <b>الهاتف / Phone:</b> ${phone}`,
            `📍 <b>العنوان / Address:</b> ${address}`,
            `💳 <b>طريقة الدفع / Payment:</b> ${payment}`,
            ``,
            `📦 <b>المنتجات / Items:</b>`,
            itemsText,
            ``,
            `💰 <b>المجموع / Total:</b> ${total} DZD`,
            notes,
            ``,
            `⏰ ${escapeHtml(timestamp)}`,
        ]
            .join('\n')
            .trim();

        const url = `${TELEGRAM_API_BASE}/bot${botToken}/sendMessage`;

        const response = await fetch(url, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id:                  chatId,
                text:                     message,
                parse_mode:               'HTML',
                disable_web_page_preview: true, // Don't expand product link previews
            }),
        });

        if (!response.ok) {
            const errBody = await response.text();
            console.error(`[Telegram] Failed to send notification. Status: ${response.status} — ${errBody}`);
        } else {
            console.log(`[Telegram] ✅ Order notification sent for order #${orderId}`);
        }
    } catch (error) {
        // Never let Telegram errors break the order flow
        console.error('[Telegram] Error sending notification:', error.message);
    }
};

/**
 * Sends a Telegram notification for a new contact form submission.
 * This function is fire-and-forget; errors are logged but never thrown.
 *
 * @param {Object} contactData - The submitted contact data {name, email, subject, message}
 */
export const sendTelegramContactMessage = async ({ name, email, subject, message }) => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId   = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId || botToken === 'your-bot-token-here' || chatId === 'your-chat-id-here') {
        console.warn('[Telegram] Bot token or chat ID not configured. Skipping contact notification.');
        return;
    }

    try {
        const safeName    = escapeHtml(name || 'N/A');
        const safeEmail   = escapeHtml(email || 'N/A');
        const safeSubject = escapeHtml(subject || 'N/A');
        const safeMessage = escapeHtml(message || 'N/A');
        const timestamp = new Date().toLocaleString('fr-DZ', {
            timeZone:  'Africa/Algiers',
            dateStyle: 'short',
            timeStyle: 'short',
        });

        const telegramMessage = [
            `✉️ <b>رسالة تواصل جديدة / New Contact Message</b>`,
            ``,
            `👤 <b>الاسم / Name:</b> ${safeName}`,
            `📧 <b>البريد / Email:</b> ${safeEmail}`,
            `📌 <b>الموضوع / Subject:</b> ${safeSubject}`,
            ``,
            `💬 <b>الرسالة / Message:</b>`,
            safeMessage,
            ``,
            `⏰ ${escapeHtml(timestamp)}`,
        ]
            .join('\n')
            .trim();

        const url = `${TELEGRAM_API_BASE}/bot${botToken}/sendMessage`;

        const response = await fetch(url, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id:                  chatId,
                text:                     telegramMessage,
                parse_mode:               'HTML',
            }),
        });

        if (!response.ok) {
            const errBody = await response.text();
            console.error(`[Telegram] Failed to send contact notification. Status: ${response.status} — ${errBody}`);
        } else {
            console.log(`[Telegram] ✅ Contact notification sent from ${safeName}`);
        }
    } catch (error) {
        console.error('[Telegram] Error sending contact notification:', error.message);
    }
};

