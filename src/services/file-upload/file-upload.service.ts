import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileUploadService {
    async uploadFile(file?: Express.Multer.File, directory?: string, changeName: boolean = true) {
        if (!file && !directory) return;

        try {
            let fileName = file.originalname;
            if (changeName) {
                const fileType = path.extname(file.originalname);
                fileName = uuidv4() + fileType;
            }

            if (fs.existsSync(path.join(process.env.UPLOAD_FILE_PATH, directory, fileName))) {
                throw new BadRequestException('File Already Exists!');
            }

            const filePath = path.join(directory, fileName).replace('\\', '/').replace('\\', '/');
            const folderPath = path.join(process.env.UPLOAD_FILE_PATH, directory);

            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }

            fs.writeFileSync(path.join(folderPath, fileName), file.buffer);
            return filePath;
        } catch (error) {
            console.log('🚀 ~ file: file-upload.service.ts:32 ~ FileUploadService ~ uploadFile ~ error:', error);
            throw new BadRequestException();
        }
    }

    async fileExists(fileName: string) {
        const filePath = path.join(process.env.UPLOAD_FILE_PATH, fileName);
        try {
            fs.accessSync(filePath, fs.constants.F_OK);
            return true;
        } catch (err) {
            return false;
        }
    }

    async deleteFile(fileName: string) {
        if (!fileName) {
            throw new BadRequestException();
        }

        try {
            const folderPath = path.join(process.env.UPLOAD_FILE_PATH, fileName);
            if (await this.fileExists(fileName)) {
                await fs.promises.unlink(folderPath).then(() => console.log('deleted!'));
            }
        } catch (error) {
            throw new BadRequestException();
        }
    }
}
