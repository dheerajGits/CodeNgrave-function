import { generateGCode } from './generateGCode';

export const handler = async (event) => {
  try {
    const form = new multiparty.Form();
    const parseForm = util.promisify(form.parse);
    const { files } = await parseForm(event);

    if (!files || !files.image || files.image.length === 0) {
      return { statusCode: 400, body: "No image file received" };
    }

    const imageFile = files.image[0];
    const imagePath = imageFile.path;

    const gcode = await generateGCode(imagePath);

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/plain" },
      body: gcode,
    };
  } catch (error) {
    console.error("Error processing image:", error);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};




