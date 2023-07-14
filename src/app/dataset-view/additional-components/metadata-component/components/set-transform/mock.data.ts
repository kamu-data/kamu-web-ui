import {
    DataSchemaFormat,
    DatasetKind,
    EnginesQuery,
    GetDatasetSchemaQuery,
    QueryDialect,
} from "src/app/api/kamu.graphql.interface";
import { SetTransFormYamlType } from "./set-transform.types";

export const mockEngines: EnginesQuery = {
    data: {
        knownEngines: [
            {
                dialect: QueryDialect.SqlSpark,
                latestImage: "ghcr.io/kamu-data/engine-spark:0.1.2",
                name: "Spark",
            },
            {
                dialect: QueryDialect.SqlDataFusion,
                latestImage: "ghcr.io/kamu-data/engine-datafusion:0.1.2",
                name: "DataFusion",
            },
            {
                dialect: QueryDialect.SqlFlink,
                latestImage: "ghcr.io/kamu-data/engine-flink:0.1.2",
                name: "Flink",
            },
        ],
    },
};

export const mockCurrentSetTransform: SetTransFormYamlType = {
    kind: "setTransform",
    inputs: [],
    transform: {
        kind: "sql",
        engine: "flink",
        queries: [],
        query: "",
    },
};

export const mockGetDatasetSchemaQuery: GetDatasetSchemaQuery = {
    datasets: {
        __typename: "Datasets",
        byId: {
            __typename: "Dataset",
            metadata: {
                __typename: "DatasetMetadata",
                currentSchema: {
                    __typename: "DataSchema",
                    format: DataSchemaFormat.ParquetJson,
                    content:
                        '{"name": "org.apache.flink.avro.generated.record", "type": "struct", "fields": [{"name": "offset", "repetition": "REQUIRED", "type": "INT64"}, {"name": "system_time", "repetition": "REQUIRED", "type": "INT64", "logicalType": "TIMESTAMP(MILLIS,true)"}, {"name": "block_time", "repetition": "OPTIONAL", "type": "INT64", "logicalType": "TIMESTAMP(MILLIS,true)"}, {"name": "block_number", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "transaction_hash", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "account_symbol", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "token_symbol", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "token_amount", "repetition": "OPTIONAL", "type": "FLOAT"}, {"name": "eth_amount", "repetition": "OPTIONAL", "type": "FLOAT"}, {"name": "token_balance", "repetition": "OPTIONAL", "type": "FLOAT"}, {"name": "token_book_value_eth", "repetition": "OPTIONAL", "type": "FLOAT"}, {"name": "account_anchor_symbol", "repetition": "REQUIRED", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "eth_amount_as_usd", "repetition": "OPTIONAL", "type": "FLOAT"}, {"name": "token_book_value_eth_as_usd", "repetition": "OPTIONAL", "type": "FLOAT"}]}',
                },
            },
            id: "did:odf:z4k88e8ctFydBwcEhtvaB9AuBL6L2kfGnNvS1LjPGLA51owXkxX",
            kind: DatasetKind.Derivative,
            name: "account.tokens.portfolio.usd",
            owner: {
                __typename: "User",
                id: "1",
                name: "kamu",
            },
        },
    },
};

export const mockParseSetTransFormYamlType = {
    kind: "setTransform",
    inputs: [
        {
            id: "did:odf:z4k88e8uh4Cg8p7pXqxDRHhUKNEkq8KhMQgZyqQg7VhsErRJmht",
            name: "account.tokens.transfers",
        },
        {
            id: "did:odf:z4k88e8pg152zufm67hBW43xwHq2bvyPa62SFNMJusgK3hgWAfC",
            name: "account.transactions",
        },
    ],
    transform: {
        kind: "sql",
        engine: "flink",
        queries: [
            {
                alias: "token_transfers",
                query: "select\n  *,\n  case\n    when `to` = '0xeadb3840596cabf312f2bc88a4bb0b93a4e1ff5f' then value_fp\n    when `from` = '0xeadb3840596cabf312f2bc88a4bb0b93a4e1ff5f' then -value_fp\n    else 0\n  end as token_amount\nfrom (\n  select\n    *,\n    cast(`value` as float) / power(10.0, cast(token_decimal as int)) as value_fp\n  from `account.tokens.transfers`\n)\n",
            },
            {
                alias: "transactions",
                query: "select\n  *,\n  case\n    when `to` = '0xeadb3840596cabf312f2bc88a4bb0b93a4e1ff5f' then value_fp\n    when `from` = '0xeadb3840596cabf312f2bc88a4bb0b93a4e1ff5f' then -value_fp\n    else 0\n  end as eth_amount\nfrom (\n  select\n    *,\n    cast(`value` as float) / power(10.0, 18) as value_fp\n  from `account.transactions`\n)\n",
            },
            {
                alias: "token_transactions",
                query: "select\n  tr.block_time,\n  tr.block_number,\n  tr.transaction_hash,\n  tx.symbol as account_symbol,\n  tr.token_symbol,\n  tr.token_amount,\n  tx.eth_amount\nfrom token_transfers as tr\nleft join transactions as tx\non \n  tr.transaction_hash = tx.transaction_hash\n  and tr.block_time = tx.block_time\n",
            },
            {
                alias: "account.tokens.portfolio",
                query: "select\n  *,\n  sum(token_amount) over (partition by token_symbol order by block_time) as token_balance,\n  sum(-eth_amount) over (partition by token_symbol order by block_time) as token_book_value_eth\nfrom token_transactions\n",
            },
        ],
    },
} as SetTransFormYamlType;

export const mockSetTransformEventYaml =
    "kind: MetadataBlock\nversion: 2\ncontent:\n  systemTime: 2023-07-04T18:55:54.594764979Z\n  prevBlockHash: zW1bxmABoYUGr2r8V4kVUoVsNBo4Nas4rmiqeguzQE7nzX4\n  sequenceNumber: 1\n  event:\n    kind: setTransform\n    inputs:\n    - id: did:odf:z4k88e8uh4Cg8p7pXqxDRHhUKNEkq8KhMQgZyqQg7VhsErRJmht\n      name: account.tokens.transfers\n    - id: did:odf:z4k88e8pg152zufm67hBW43xwHq2bvyPa62SFNMJusgK3hgWAfC\n      name: account.transactions\n    transform:\n      kind: sql\n      engine: flink\n      queries:\n      - alias: token_transfers\n        query: |\n          select\n            *,\n            case\n              when `to` = '0xeadb3840596cabf312f2bc88a4bb0b93a4e1ff5f' then value_fp\n              when `from` = '0xeadb3840596cabf312f2bc88a4bb0b93a4e1ff5f' then -value_fp\n              else 0\n            end as token_amount\n          from (\n            select\n              *,\n              cast(`value` as float) / power(10.0, cast(token_decimal as int)) as value_fp\n            from `account.tokens.transfers`\n          )\n      - alias: transactions\n        query: |\n          select\n            *,\n            case\n              when `to` = '0xeadb3840596cabf312f2bc88a4bb0b93a4e1ff5f' then value_fp\n              when `from` = '0xeadb3840596cabf312f2bc88a4bb0b93a4e1ff5f' then -value_fp\n              else 0\n            end as eth_amount\n          from (\n            select\n              *,\n              cast(`value` as float) / power(10.0, 18) as value_fp\n            from `account.transactions`\n          )\n      - alias: token_transactions\n        query: \"select\\n  tr.block_time,\\n  tr.block_number,\\n  tr.transaction_hash,\\n  tx.symbol as account_symbol,\\n  tr.token_symbol,\\n  tr.token_amount,\\n  tx.eth_amount\\nfrom token_transfers as tr\\nleft join transactions as tx\\non \\n  tr.transaction_hash = tx.transaction_hash\\n  and tr.block_time = tx.block_time\\n\"\n      - alias: account.tokens.portfolio\n        query: |\n          select\n            *,\n            sum(token_amount) over (partition by token_symbol order by block_time) as token_balance,\n            sum(-eth_amount) over (partition by token_symbol order by block_time) as token_book_value_eth\n          from token_transactions\n";

export const mockSetTransformEventYamlWithQuery =
    "kind: MetadataBlock\nversion: 2\ncontent:\n  systemTime: 2023-07-04T18:55:54.498288820Z\n  prevBlockHash: zW1kygYTBseWFvCde79YE466bUGpxxes22edhtUjRBVYQPA\n  sequenceNumber: 1\n  event:\n    kind: setTransform\n    inputs:\n    - id: did:odf:z4k88e8h3LaJcngSzrj5J3kxBnPpwKqaYExJFxDvhzZJ8QxmRvX\n      name: alberta.case-details\n    transform:\n      kind: sql\n      engine: datafusion\n      query: \"select\\n  id,\\n  date_reported as reported_date,\\n  case when lower(gender) = 'male' then 'M' \\n       when lower(gender) = 'female' then 'F' \\n       else 'U' end as gender,\\n  case when age_group = 'Under 1 year' then '<20'\\n       when age_group = '1-4 years' then '<20'\\n       when age_group = '5-9 years' then '<20'\\n       when age_group = '10-19 years' then '<20'\\n       when age_group = '20-29 years' then '20s'\\n       when age_group = '30-39 years' then '30s'\\n       when age_group = '40-49 years' then '40s'\\n       when age_group = '50-59 years' then '50s'\\n       when age_group = '60-69 years' then '60s'\\n       when age_group = '70-79 years' then '70s'\\n       when age_group = '80+ years' then '80s'\\n       else 'UNKNOWN' end as age_group,\\n  zone as location\\nfrom \\\"alberta.case-details\\\"\\n\"\n";
