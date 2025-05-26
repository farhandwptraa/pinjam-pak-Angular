export interface PengajuanListResponseDTO {
    pengajuanId: string;
    namaCustomer: string;
    amount: string;
    status: string;
    tanggalPengajuan: string;
    namaMarketing: string;
  }

  export interface PengajuanPendingResponseDTO {
    idPengajuan: string;
    namaCustomer: string;
    amount: number;
    tenor: number;
    status: string;
    tanggalPengajuan: string;
    catatanMarketing: string | null;
    catatanManager: string | null;
    lokasi: string;
    amountFinal: string;
    namaMarketing: string;
  }  
  