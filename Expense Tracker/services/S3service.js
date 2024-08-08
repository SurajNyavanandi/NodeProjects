const AWS = require('aws-sdk');
require('dotenv').config();

function uploadToS3(data, filename) {
    const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
    const IAM_USER_KEY = process.env.AWS_IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.AWS_IAM_USER_SECRET;
    
    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET
    });

    const params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    };

    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, data) => {
            if (err) {
                console.log("Something went wrong while uploading the file to AWS", err);
                reject(err);
            } else {
                console.log("Successfully uploaded data to AWS", data);
                resolve(data.Location);
            }
        });
    });
}

module.exports = uploadToS3;
