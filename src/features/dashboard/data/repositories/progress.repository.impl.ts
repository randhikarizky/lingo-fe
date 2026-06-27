import { progressApi } from "../network/progress.api";

class ProgressRepositoryImpl {
  async getSummary() {
    const { data } = await progressApi.getSummary();
    return data.data;
  }

  async getActivity() {
    const { data } = await progressApi.getActivity();
    return data.data;
  }
}

export const progressService = new ProgressRepositoryImpl();
