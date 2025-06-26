import { config } from 'dotenv';

config();

interface TelegramMessage {
  text: string;
  parse_mode?: 'HTML' | 'Markdown';
}

export class TelegramService {
  private botToken: string;
  private chatId: string;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    this.chatId = process.env.TELEGRAM_CHAT_ID || '';

    if (!this.botToken || !this.chatId) {
      console.warn('Telegram bot token or chat ID not configured');
    }
  }

  async sendMessage(message: TelegramMessage): Promise<boolean> {
    if (!this.botToken || !this.chatId) {
      console.warn('Telegram not configured, skipping message');
      return false;
    }

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${this.botToken}/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: this.chatId,
            text: message.text,
            parse_mode: message.parse_mode || 'HTML',
          }),
        },
      );

      if (!response.ok) {
        const error = await response.text();
        console.error('Failed to send telegram message:', error);
        return false;
      }

      console.log('Telegram message sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending telegram message:', error);
      return false;
    }
  }

  async sendWeeklyStats(stats: any): Promise<boolean> {
    const message = this.formatWeeklyStats(stats);
    return this.sendMessage({ text: message, parse_mode: 'HTML' });
  }

  private formatWeeklyStats(stats: any): string {
    return `
📊 <b>Weekly NEARN Stats Report</b>

👥 <b>Users:</b>
• Total users: <b>${stats.totalUsers.toLocaleString()}</b>
• Talent accounts (at least 1 submission): <b>${stats.talentUsers.toLocaleString()}</b>
• Active talent accounts (at least 1 submission in the last 14 days): <b>${stats.activeTalentUsers.toLocaleString()}</b>
• Sponsor accounts: <b>${stats.sponsorAccounts.toLocaleString()}</b>
• Sponsor members: <b>${stats.sponsorMembers.toLocaleString()}</b>
• Active sponsor accounts (with active bounty): <b>${stats.activeSponsorAccounts.toLocaleString()}</b>

📝 <b>Listings:</b>
• Total listings (completed + review + open): <b>${stats.totalListings.toLocaleString()}</b>
• Active listings (open): <b>${stats.totalPublicListings.toLocaleString()}</b>
• New listings for the last 7 days: <b>${stats.newListingsThisWeek.toLocaleString()}</b>
• Total submissions: <b>${stats.totalSubmissions.toLocaleString()}</b>
• New submissions for the last 7 days: <b>${stats.newSubmissionsThisWeek.toLocaleString()}</b>

💰 <b>Total Value Earned:</b>
• <b>${stats.totalEarned.toLocaleString()}</b>

💬 <b>Comments:</b>
• Total comments: <b>${stats.totalComments.toLocaleString()}</b>
• User comments: <b>${stats.notAutomatedComments.toLocaleString()}</b>
• New comments for the last 7 days: <b>${stats.newCommentsThisWeek.toLocaleString()}</b>
• New user comments for the last 7 days: <b>${stats.notAutomatedCommentsThisWeek.toLocaleString()}</b>

#metrics`.trim();
  }
}

export const telegramService = new TelegramService();
