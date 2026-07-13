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