export class ContractTerms {
    PartnerAccountDetailID: number=0;
    PartnerID: number = 0;
    LineHaulRateUOMID: number;
    LineHaulRate: number;
    AccrualTerm: number;
    AccrualDay: number;
    ServiceCost: number;
    PaymentTermID: number;
    GracePeriodDay: number;
    LatePenaltyPercentage: number;
    isAccrual: boolean;
    CreatedBy: string;
    CreatedDate: Date;
    ModifyBy: string;
    ModifyDate: Date;


    constructor()
    constructor(ContractTerms: ContractTerms)
    constructor(ContractTerms?: any) {
        this.PartnerAccountDetailID = ContractTerms && ContractTerms.PartnerAccountDetailID || 0;
        this.PartnerID = ContractTerms && ContractTerms.PartnerAccountDetailID || 0;
        //this.LineHaulRateUOMID = ContractTerms && ContractTerms.LineHaulRateUOMID || null;
        this.LineHaulRate = ContractTerms && ContractTerms.LineHaulRate || null;
        this.AccrualTerm = ContractTerms && ContractTerms.AccrualTerm || null;
        this.AccrualDay = ContractTerms && ContractTerms.AccrualDay || null;
        this.ServiceCost = ContractTerms && ContractTerms.ServiceCost || null;
        //this.PaymentTermID = ContractTerms && ContractTerms.PaymentTermID || null;
        this.GracePeriodDay = ContractTerms && ContractTerms.GracePeriodDay || null;
        this.LatePenaltyPercentage = ContractTerms && ContractTerms.LatePenaltyPercentage || null;
        this.isAccrual = ContractTerms && ContractTerms.isAccrual || false;
    }
    
}
 