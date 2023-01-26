import fs from 'fs';
const fse = require('fs-extra')

export default class Data {

    private statusFile = './results/status.json';    

    constructor(){
        console.log(__dirname);
        this.verifyStatusFile();
    }

    async updateStatus(value:any){
        try{
            await this.verifyStatusFile();
            let content = await this.getContent();

            if(content[value.userName]){
                let numOfSuccess = content[value.userName].numOfSuccess;
                numOfSuccess++                
                content[value.userName].numOfSuccess = numOfSuccess;
            }else{
                content[value.userName] = {
                    "name":value.userName,
                    "numOfSuccess":1
                };
            }

            this.saveToFile(content, this.statusFile);
        }catch(error){
            console.log(`updateStatus ERORR - ${error}`);
        }
    }

    async getContent(){
        // Get content of the file
        // Return empty JSON {} if file does not exist or it's content can't be parsed
        let parsedJson = JSON.parse('{}');
        try{
            // specifying (utf8) encoding forces readFileSync to return string
            const dataStr = fs.readFileSync(this.statusFile, 'utf8');
            // Convert file content from string to JSON and back to string
            if (dataStr !== "" &&  dataStr !=="[]") {
                parsedJson = JSON.parse(dataStr);
            }            

        } catch (error){
            console.log(`getContent: ${error}`);
        }
        return parsedJson;
    }
 

    async saveToFile(data: any, filePath:string){
        // Return 0 on success, 1 on failure.
        let status = 0; 
        try{
            fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
        } catch (error){
            console.log(`saveToFile: ${error}`);
            status = 1;
        }
        return status;
    }

    async getSortedData(){
        try{    
            let statusContnet = await this.getContent();
            //sort
            let sortedData = await this.sort(statusContnet) || [];

            return sortedData;
        }catch(error){
            console.log(`getSortedData: ${error}`);
        }
    }

    async sort(jsonData: any){
        //Conver to Array and sort
        try{
            const arr = Object.keys(jsonData).map((key) => [key, jsonData[key]]);
            arr.sort(this.sortBySuccess);
            return arr;
        }catch(error){
            console.log(`Sort ${error}`)
        }
    }

    sortBySuccess(a: any, b:any) {
        try{
            let key = "numOfSuccess";
            return (b[1][key]) - (a[1][key]);
        }catch(error){
            console.log(`sortBySuccess ${error}`);
            return -1;
        } 
    }

    async verifyStatusFile(){
        try {
            await fse.ensureFile(this.statusFile);
            console.log('success!')
        } catch (error) {
            console.log(`verifyStatusFile ERORR - ${error}`);
        }
    }
}