export type PoapInterface = {
  id: number;
  collectionUuid: string;
  title: string;
  description: string;
  status: number;
  website: string;
  createTime: string;
  updateTime: string;
  startTime: string;
  endTime: string;
};
export type PoapResponse = GeneralResponse<PoapInterface>;
export type PoapsResponse = GeneralItemsResponse<PoapInterface>;

export type PoapReservationInterface = {
  id: number;
  poapDrop_id: number;
  airdropStatus: number;
  email: string;
  wallet: string;
  txHash: string | null;
  status: number;
  createTime: string;
  updateTime: string;
};
export type PoapReservationResponse = GeneralResponse<PoapReservationInterface>;
export type PoapReservationsResponse = GeneralItemsResponse<PoapReservationInterface>;

export enum AirdropStatus {
  PENDING = 1,
  EMAIL_SENT,
  EMAIL_ERROR,
  WALLET_LINKED,
  TRANSACTION_CREATED,
  AIRDROP_COMPLETED,
  AIRDROP_ERROR,
}

/**
 * 0 = Not yet started, 1 = In progress, 2 = Finished
 */
export enum PoapStatus {
  WAITING = 0,
  IN_PROGRESS = 1,
  FINISHED = 2,
}
