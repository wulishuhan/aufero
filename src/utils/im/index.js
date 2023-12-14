import Sdk from "@/utils/im/sdk";
import Event from "@/utils/im/event";
import { getToken } from "@/utils/auth";
export default {
  create(url) {
    return new Sdk(url + "?token=" + getToken());
  },
  Event: Event,
};
