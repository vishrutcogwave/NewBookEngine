import api from "./axios";
import ENDPOINTS from "./endpoints";


export interface HotelDataParams {
  propertyid: string;
  HotelID: string;
  Branchcode: string;
  checkindate: string;
  checkoutdate: string;
}

export const getHotelData = async (params: HotelDataParams) => {
  const { data } = await api.get(ENDPOINTS.GET_HOTEL_DATA, {
    params,
  });

  return data;
};




export const getHotelPolicy = async (
  propertyid: string,
  HotelID: string,
  Branchcode: string
) => {
  const { data } = await api.get(ENDPOINTS.GET_HOTEL_POLICY, {
    params: {
      propertyid,
      HotelID,
      Branchcode,
    },
  });

  return data;
};


export const getHotelTerms = async (
  propertyid: string,
  HotelID: string,
  Branchcode: string
) => {
  const { data } = await api.get(ENDPOINTS.GET_HOTEL_TERMS, {
    params: {
      propertyid,
      HotelID,
      Branchcode,
    },
  });

  return data;
};

export const getHotelRefundPolicy = async (
  propertyid: string,
  HotelID: string,
  Branchcode: string
) => {
  const { data } = await api.get(ENDPOINTS.GET_HOTEL_REFUND_POLICY, {
    params: {
      propertyid,
      HotelID,
      Branchcode,
    },
  });

  return data;
};

export const getHotelContact = async (
  propertyid: string,
  HotelID: string,
  Branchcode: string
) => {
  const { data } = await api.get(ENDPOINTS.GET_HOTEL_CONTACT, {
    params: {
      propertyid,
      HotelID,
      Branchcode,
    },
  });

  return data;
};
export interface TaxAmountParams {
  propertyid: string;
  HotelID: string;
  Branchcode: string;
  amount: number;
}

export const getTaxAmount = async ({
  propertyid,
  HotelID,
  Branchcode,
  amount,
}: TaxAmountParams) => {
  const { data } = await api.get(ENDPOINTS.GET_TAX_AMOUNT, {
    params: {
      propertyid,
      HotelID,
      Branchcode,
      amount,
    },
  });

  return data;
};







export interface CreatePhonePePaymentParams {
  Amount: number;
  RedirectURL: string;
  branchcode: string;
  Propertycode: string;
  HotelId: string;
}

export const createPhonePePayment = async ({
  Amount,
  RedirectURL,
  branchcode,
  Propertycode,
  HotelId,
}: CreatePhonePePaymentParams) => {
  const { data } = await api.get(ENDPOINTS.CREATE_PHONEPE_PAYMENT, {
    params: {
      Amount,
      RedirectURL,
      branchcode,
      Propertycode,
      HotelId,
    },
  });

  return data;
};



export interface PhonePePaymentStatusParams {
  MerchantorderID: string;
  branchcode: string;
  Propertycode: string;
  HotelId: string;
}

export const getPhonePePaymentStatus = async ({
  MerchantorderID,
  branchcode,
  Propertycode,
  HotelId,
}: PhonePePaymentStatusParams) => {
  const { data } = await api.get(ENDPOINTS.PHONEPE_PAYMENT_STATUS, {
    params: {
      MerchantorderID,
      branchcode,
      Propertycode,
      HotelId,
    },
  });

  return data;
};

export interface OtherChargesParams {
  propertyid: string;
  HotelID: string;
  Branchcode: string;
}

export const getOtherCharges = async ({
  propertyid,
  HotelID,
  Branchcode,
}: OtherChargesParams) => {
  const { data } = await api.get(ENDPOINTS.GET_OTHER_CHARGES, {
    params: {
      propertyid,
      HotelID,
      Branchcode,
    },
  });

  return data;
};


export interface SubmitReservationParams {
  propertyid: string;
  HotelID: string;
  Branchcode: string;
  payload: any;
}

export const submitReservationData = async ({
  propertyid,
  HotelID,
  Branchcode,
  payload,
}: SubmitReservationParams) => {
  const { data } = await api.post(
    ENDPOINTS.SUBMIT_RESERVATION_DATA,
    payload,
    {
      params: {
        propertyid,
        HotelID,
        Branchcode,
      },
    }
  );

  return data;
};