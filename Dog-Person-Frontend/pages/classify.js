import { useState } from 'react';
import style from '../styles/classify.module.css'
import * as tf from '@tensorflow/tfjs'
import * as tmImage from '@teachablemachine/image'
const Classify = () => {
    let model;
    const [puppy, setPuppy] = useState(null)
    const handleImageUpload = (e) => {
        if (e.target.files[0]) {
            setPuppy(URL.createObjectURL(e.target.files[0]))
        }
        else {
            setPuppy(null)
        }
    }
    async function runmodel() {
        const url = "https://raw.githubusercontent.com/farjana579/Dog-Person/main/Dog-Person-Frontend/models/";
        const modelUrl = url + "model.json"
        const metaDataUrl = url + "metadata.json"
        model = await tmImage.load(modelUrl, metaDataUrl);
        const classCount = model.getTotalClasses();
        let image = new Image(200, 150)
        image.src = puppy;
        // let tfTensor = tf.browser.fromPixels(image);
        // tfTensor = tfTensor.div(255.0);
        // tfTensor = tfTensor.expandDims(0);
        // tfTensor = tfTensor.cast("float32");
        try {
            const imageBitmap = createImageBitmap(image);
            console.log(image);
            const pred = model.predict(imageBitmap).arraySync()[0];
            let res = pred.squeeze();
        } catch (Exception) {

        }
    }
    const handlePredict = () => {
        runmodel();
    }
    return (
        <div className={style.container}>

            <div className={style.imageContainer}>
                {
                    puppy &&
                    <img src={puppy} alt="Puppy" />
                }
            </div>
            <div className={style.classifyContainer}>
                <div>
                    <div className={style.pageTitle}>
                        Predict the breed of your <span>pet</span>
                    </div>
                    <div className={style.message}>
                        In this playground competition, you are provided a strictly canine subset of ImageNet in order to practice fine-grained image categorization. How well you can tell your Norfolk Terriers from your Norwich Terriers? With 120 breeds of dogs and a limited number training images per class, you might find the problem more, err, ruff than you anticipated.
                    </div>
                    <div className={style.uploadImage}>
                        <button className={style.classifyButton}>Upload an Image</button>
                        <input type="file" src="" alt="image input" className={style.imageInput} accept="image/*" onChange={handleImageUpload} />
                    </div>
                    {
                        puppy && <button className={style.predictButton} onClick={handlePredict}>Predict</button>
                    }
                </div>
            </div>
        </div>
    );
};

export default Classify;