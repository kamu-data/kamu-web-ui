import { Injectable } from "@angular/core";

@Injectable()
export default class SavedQueriesValues {
    public static savedQueries = [
        {
            time: "10:02 AM",
            title: "Query #4",
            query: `select
    offset, system_time, case_reported_date as reported_date, city as location, gender, age_group
from 'ca.ontario.data.covid19.case-details'
union all
select
    offset, system_time, reported_date, ha as location, sex as gender, age_group
from 'ca.bccdc.covid19.case-details'
order by reported_date desc`,
        },
        {
            time: "9:09 AM",
            title: "Query #3",
            query:
                "CREATE TABLE dbo.EmployeePhoto\n" +
                "(\n" +
                "    EmployeeId INT NOT NULL PRIMARY KEY,\n" +
                "    Photo VARBINARY(MAX) FILESTREAM NULL,\n" +
                "    MyRowGuidColumn UNIQUEIDENTIFIER NOT NULL ROWGUIDCOL\n" +
                ");\n" +
                "\n" +
                "GO\n}",
        },
        {
            time: "9:05 AM",
            title: "Query #2",
            query:
                "CREATE TABLE dbo.EmployeePhoto\n" +
                "(\n" +
                "    EmployeeId INT NOT NULL PRIMARY KEY,\n" +
                "    Photo VARBINARY(MAX) FILESTREAM NULL,\n" +
                ");\n" +
                "\n" +
                "GO\n}",
        },
        {
            time: "9:01 AM",
            title: "Query #1",
            query:
                "CREATE TABLE dbo.EmployeePhoto\n" +
                "(\n" +
                "    EmployeeId INT NOT NULL PRIMARY KEY,\n" +
                ");\n" +
                "\n" +
                "GO\n}",
        },
    ];
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
