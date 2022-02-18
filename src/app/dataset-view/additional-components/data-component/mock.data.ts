import {Injectable} from "@angular/core";

@Injectable()
export default class DataTabValues {
    public static savedQueries = [
        {
            time: "10:02 AM",
            title: "Table has been changed",
            query: "CREATE TABLE dbo.EmployeePhoto\n" +
                "(\n" +
                "    EmployeeId INT NOT NULL PRIMARY KEY,\n" +
                "    Photo VARBINARY(MAX) FILESTREAM NULL,\n" +
                "    MyRowGuidColumn UNIQUEIDENTIFIER NOT NULL ROWGUIDCOL\n" +
                "                    UNIQUE DEFAULT NEWID()\n" +
                ");\n" +
                "\n" +
                "GO\n}"
        },
        {
            time: "9:09 AM",
            title: "Table has been changed",
            query: "CREATE TABLE dbo.EmployeePhoto\n" +
                "(\n" +
                "    EmployeeId INT NOT NULL PRIMARY KEY,\n" +
                "    Photo VARBINARY(MAX) FILESTREAM NULL,\n" +
                "    MyRowGuidColumn UNIQUEIDENTIFIER NOT NULL ROWGUIDCOL\n" +
                ");\n" +
                "\n" +
                "GO\n}"
        },
        {
            time: "9:05 AM",
            title: "Table has been changed",
            query: "CREATE TABLE dbo.EmployeePhoto\n" +
                "(\n" +
                "    EmployeeId INT NOT NULL PRIMARY KEY,\n" +
                "    Photo VARBINARY(MAX) FILESTREAM NULL,\n" +
                ");\n" +
                "\n" +
                "GO\n}"
        },
        {
            time: "9:01 AM",
            title: "Table has been created",
            query: "CREATE TABLE dbo.EmployeePhoto\n" +
                "(\n" +
                "    EmployeeId INT NOT NULL PRIMARY KEY,\n" +
                ");\n" +
                "\n" +
                "GO\n}"
        }];
    public static sqlRequestCode: string =
        "CREATE TABLE dbo.EmployeePhoto\n" +
        "(\n" +
        "    EmployeeId INT NOT NULL PRIMARY KEY,\n" +
        "    Photo VARBINARY(MAX) FILESTREAM NULL,\n" +
        "    MyRowGuidColumn UNIQUEIDENTIFIER NOT NULL ROWGUIDCOL\n" +
        "                    UNIQUE DEFAULT NEWID()\n" +
        ");\n" +
        "\n" +
        "GO\n}";
}