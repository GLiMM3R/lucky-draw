export class CampaignReport {
    campaign: string;
    prize: string;
    winnerName: string;
    winnerPhone: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(campaign: string, prize: string, winnerName: string, winnerPhone: string, createdAt: Date, updatedAt: Date) {
        this.campaign = campaign;
        this.prize = prize;
        this.winnerName = winnerName;
        this.winnerPhone = winnerPhone;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
