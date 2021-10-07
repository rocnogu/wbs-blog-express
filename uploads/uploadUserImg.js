import aws from 'aws-sdk';
import multer from 'multer';
import sharp from 'sharp';
import multerS3  from 'multer-s3-v3';
import dotenv from 'dotenv';
dotenv.config()
//
const bucketName = process.env.AWS_BUCKET_USER
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY
//
const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey
})
//
export  const uploadUserImg = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName,
    transforms: () =>
    sharp()
      .jpeg({
        quality: 100
      }),
    metadata: function(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, { fieldName: file.fieldname })
        } else {
            cb(null, false)
        }
    },
    key: function(req, file, cb) {
        const splitString = file.originalname.split(".")
      cb(null, Date.now().toString() + Math.round(Math.random() * 1E9) + '.' + splitString[splitString.length-1]);
    },
    throwMimeTypeConflictErrorIf: (contentType, mimeType, _file) => ![mimeType, 'application/octet-stream'].includes(contentType)
  })
});


 