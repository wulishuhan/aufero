export function generatorDefaultAvator(text, serNum = 0, size = 255, bgcolor) {
  //设置头像昵称，如果为null或者为空时，设置为无
  let nickname = text == null ? "" : text == "" ? " " : text;
  //设置头像大小
  let avatarSize = size == null ? 255 : size;

  //设置头像内部文字大小
  let fontSize = size == null ? 15 : avatarSize / 2;

  //设置头像内部字体
  let fontWeight = "normal";

  //设置头像背景颜色
  let colors = [
    "#31bc9f",
    "#33cc70",
    "#4a94db",
    "#9b5fb6",
    "#34495e",
    "#16a085",
    "#27ae60",
    "#2980b9",
    "#8e44ad",
    "#2c3e50",
    "#f1cb1e",
    "#e6761b",
    "#e7363b",
    "#00bcd4",
    "#95a5a6",
    "#f39c12",
    "#d35400",
    "#c0392b",
    "#bdc3c7",
    "#7f8c8d",
  ];
  let avatarColor =
    bgcolor == null
      ? colors[Math.floor(serNum % colors.length)]
      : bgcolor == ""
      ? bgcolor
      : colors[Math.floor(serNum % colors.length)];

  /*根据id获取canvas
   * 如果为空，则创建新的canvas
   * */
  let canvas = document.createElement("canvas");

  //初始化canvas设置
  canvas.width = avatarSize;
  canvas.height = avatarSize;
  let context = canvas.getContext("2d");

  //头像背景颜色设置
  context.fillStyle = avatarColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  //头像字体颜色设置
  context.fillStyle = "#FFFFFF";
  context.font = fontWeight + " " + fontSize + "px sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";

  context.fillText(nickname.charAt(0), fontSize, fontSize);
  return canvas.toDataURL("image/png");
}

/*
 *生成缩略图
 * @param {html tag object} image： html tag
 * @param {number} width： width of the thumbnail
 * @param {number} height： height of the thumbnail
 * @return {file}  file: file of the thumbnail
 */
export async function generatorThumbnail(srcFile, width, height) {
  return new Promise((resolve, reject) => {
    let extension = srcFile.name
      .substring(srcFile.name.lastIndexOf(".") + 1)
      .toLowerCase();
    console.log("extension", extension);
    if (extension === "svg") {
      console.log("svg");
      reject("error");
      return;
    }
    //判断文件类型，如果是图片，则生成截图
    if (srcFile.type.indexOf("image") < 0) {
      reject("error");
      return;
    }
    const image = new Image();
    image.src = URL.createObjectURL(srcFile);
    image.setAttribute("crossOrigin", "Anonymous");

    image.onload = () => {
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
      var maxw = width;
      var maxh = height;

      var cw = image.width;
      var ch = image.height;
      var w = image.width;
      var h = image.height;
      canvas.width = w;
      canvas.height = h;
      if (cw > maxw && cw > ch) {
        w = maxw;
        h = (maxw * ch) / cw;
        canvas.width = w;
        canvas.height = h;
      }
      if (ch > maxh && ch > cw) {
        h = maxh;
        w = (maxh * cw) / ch;
        canvas.width = w;
        canvas.height = h;
      }
      ctx.drawImage(image, 0, 0, w, h);
      try {
        canvas.toBlob((blob) => {
          var thumbFile = new File([blob], srcFile.name, {
            type: srcFile.type,
          });

          resolve(thumbFile);
          //上传缩略图
        }, srcFile.type);
      } catch (e) {
        reject(e);
      }
    };
  });
}
