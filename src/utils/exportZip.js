import axios from "axios";
export async function getFileData(id, env) {
  try {
    console.log("env", env);
    let res = await axios.get(`${env}/library/resource/download/${id}`, {
      responseType: "blob",
      method: "get",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
    res = res.data;
    return new Promise((resolve) => {
      if (res.code === 0) {
        resolve(res);
      } else {
        resolve(res);
      }
    });
  } catch (err) {
    console.log(err);
  }
}
