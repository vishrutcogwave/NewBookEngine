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