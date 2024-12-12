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

            const filePath = path.join(directory, fileName).replace('\\', '/').replace('\\', '/').replace('\\', '/');
            const folderPath = path.join(process.env.UPLOAD_FILE_PATH, directory);

            if (!fs.existsSync(path.join(process.env.UPLOAD_FILE_PATH))) {
                fs.mkdirSync(path.join(process.env.UPLOAD_FILE_PATH), { recursive: true });
            }

            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }

            fs.writeFileSync(path.join(folderPath, fileName), file.buffer);
            return filePath;
        } catch (error) {
            throw new BadRequestException(error);
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

    async deleteDirectory(folder: string) {
        try {
            const folderPath = path.join(process.env.UPLOAD_FILE_PATH, folder);
            fs.rm(folderPath, { recursive: true }, (err) => {
                if (err) {
                    console.error(`Error removing directory: ${err}`);
                } else {
                    console.log('Directory has been removed.');
                }
            });
        } catch (error) {
            throw new BadRequestException();
        }
    }

    async copyFile(source: string, folder: string, filename: string) {
        try {
            const sourceDirectory = path.join(process.env.UPLOAD_FILE_PATH, source); // Replace with the source directory path.
            const destinationDirectory = path.join(process.env.UPLOAD_FILE_PATH, folder, filename); // Replace with the destination directory path.

            if (!fs.existsSync(path.join(process.env.UPLOAD_FILE_PATH, folder))) {
                fs.mkdirSync(path.join(process.env.UPLOAD_FILE_PATH, folder), { recursive: true });
            }

            fs.copyFile(sourceDirectory, destinationDirectory, (err) => {
                if (err) {
                    console.error(`Error copying directory: ${err}`);
                } else {
                    console.log('Directory has been successfully copied.');
                }
            });
        } catch (error) {
            throw new BadRequestException();
        }
    }
}
