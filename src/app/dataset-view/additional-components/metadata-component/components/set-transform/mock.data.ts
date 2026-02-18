/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    DataSchemaFormat,
    DatasetKind,
    EnginesQuery,
    GetDatasetSchemaQuery,
    QueryDialect,
} from "@api/kamu.graphql.interface";
import { TEST_ACCOUNT_NAME, TEST_DATASET_NAME } from "@api/mock/dataset.mock";
import { DatasetInfo } from "@interface/navigation.interface";

import { Engine } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/components/engine-section/engine-section.types";
import { SetTransformYamlType } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/set-transform.types";
import { PreprocessStepValue } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { mockOwnerFieldsWithAvatar, mockPublicDatasetVisibility } from "src/app/search/mock.data";

export const MOCK_DATASET_INFO: DatasetInfo = {
    accountName: TEST_ACCOUNT_NAME,
    datasetName: TEST_DATASET_NAME,
};

export const mockEngines: EnginesQuery = {
    data: {
        knownEngines: [
            {
                dialect: QueryDialect.SqlSpark,
                latestImage: "ghcr.io/kamu-data/engine-spark:0.1.2",
                name: Engine.Spark,
            },
            {
                dialect: QueryDialect.SqlFlink,
                latestImage: "ghcr.io/kamu-data/engine-flink:0.1.2",
                name: Engine.Flink,
            },
            {
                dialect: QueryDialect.SqlDataFusion,
                latestImage: "ghcr.io/kamu-data/engine-datafusion:0.1.2",
                name: Engine.DataFusion,
            },
            {
                dialect: QueryDialect.SqlRisingWave,
                latestImage: "ghcr.io/kamu-data/engine-risingwave:0.1.2",
                name: Engine.RisingWave,
            },
        ],
    },
};

export const mockCurrentSetTransform: SetTransformYamlType = {
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
                __typename: "Account",
                ...mockOwnerFieldsWithAvatar,
            },
            alias: "kamu/account.tokens.portfolio.usd",
            visibility: mockPublicDatasetVisibility,
        },
    },
};

export const mockParseSetTransformYamlType = {
    kind: "SetTransform",
    inputs: [
        {
            datasetRef: "did:odf:fed01be6c1c70edbc1cb8e27485fc2bd9a751591b3e85a9ef299d10d9e5c3fab69aa6",
            alias: "account.tokens.transfers",
        },
        {
            datasetRef: "did:odf:fed0100ded8aa87266a9b83f99298ec6f0bdad6cf882c6463c03d722adaf842d76096",
            alias: "account.transactions",
        },
    ],
    transform: {
        kind: "Sql",
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
                query: "select\n  *,\n  sum(token_amount) over (partition by token_symbol order by block_time) as token_balance,\n  sum(-eth_amount) over (partition by token_symbol order by block_time) as token_book_value_eth\nfrom token_transactions\n",
            },
        ],
    },
} as SetTransformYamlType;

export const mockPreprocessStepValue: PreprocessStepValue = {
    engine: "SPARK",
    queries: [
        {
            alias: "account.transactions",
            query: "SELECT\n  cast(cast(timeStamp as bigint) as timestamp) as block_time,\n  cast(blockNumber as bigint) as block_number,\n  blockHash as block_hash,\n  'eth' as symbol,\n  hash as transaction_hash,\n  transactionIndex as transaction_index,\n  nonce,\n  from,\n  to,\n  value,\n  input,\n  isError,\n  txreceipt_status,\n  contractAddress as contract_address,\n  gas,\n  gasPrice as gas_price,\n  gasUsed as gas_used,\n  cumulativeGasUsed as cumulative_gas_used,\n  confirmations\nFROM input\n",
        },
    ],
};

export const mockPreprocessStepValueWithoutQueries: PreprocessStepValue = {
    engine: "SPARK",
    queries: [],
};

export const mockSetTransformEventYaml =
    "kind: MetadataBlock\nversion: 2\ncontent:\n  systemTime: 2024-01-12T23:21:01.449684944Z\n  prevBlockHash: f1620a798caf694d544a7ad590fa2230e4c518de1acce010789d0056c61a1fa69d95a\n  sequenceNumber: 1\n  event:\n    kind: SetTransform\n    inputs:\n    - datasetRef: did:odf:fed01be6c1c70edbc1cb8e27485fc2bd9a751591b3e85a9ef299d10d9e5c3fab69aa6\n      alias: account.tokens.transfers\n    - datasetRef: did:odf:fed0100ded8aa87266a9b83f99298ec6f0bdad6cf882c6463c03d722adaf842d76096\n      alias: account.transactions\n    transform:\n      kind: Sql\n      engine: flink\n      queries:\n      - alias: token_transfers\n        query: |\n          select\n            *,\n            case\n              when `to` = '0xeadb3840596cabf312f2bc88a4bb0b93a4e1ff5f' then value_fp\n              when `from` = '0xeadb3840596cabf312f2bc88a4bb0b93a4e1ff5f' then -value_fp\n              else 0\n            end as token_amount\n          from (\n            select\n              *,\n              cast(`value` as float) / power(10.0, cast(token_decimal as int)) as value_fp\n            from `account.tokens.transfers`\n          )\n      - alias: transactions\n        query: |\n          select\n            *,\n            case\n              when `to` = '0xeadb3840596cabf312f2bc88a4bb0b93a4e1ff5f' then value_fp\n              when `from` = '0xeadb3840596cabf312f2bc88a4bb0b93a4e1ff5f' then -value_fp\n              else 0\n            end as eth_amount\n          from (\n            select\n              *,\n              cast(`value` as float) / power(10.0, 18) as value_fp\n            from `account.transactions`\n          )\n      - alias: token_transactions\n        query: \"select\\n  tr.block_time,\\n  tr.block_number,\\n  tr.transaction_hash,\\n  tx.symbol as account_symbol,\\n  tr.token_symbol,\\n  tr.token_amount,\\n  tx.eth_amount\\nfrom token_transfers as tr\\nleft join transactions as tx\\non \\n  tr.transaction_hash = tx.transaction_hash\\n  and tr.block_time = tx.block_time\\n\"\n      - query: |\n          select\n            *,\n            sum(token_amount) over (partition by token_symbol order by block_time) as token_balance,\n            sum(-eth_amount) over (partition by token_symbol order by block_time) as token_book_value_eth\n          from token_transactions\n";

export const mockSetPollingSourceEventYaml =
    "kind: MetadataBlock\nversion: 2\ncontent:\n  systemTime: 2023-07-19T11:32:40.032474125Z\n  prevBlockHash: zW1a24AfmasmU3nLWDgfTKUdrQuiWZkqzNP2A4hQMumRNX4\n  sequenceNumber: 4\n  event:\n    kind: SetPollingSource\n    fetch:\n      kind: Url\n      url: https://api.etherscan.io/api?module=account&action=txlist&address=0xeadb3840596cabf312f2bc88a4bb0b93a4e1ff5f&page=1&offset=1000&startblock=0&endblock=99999999&apikey=${{ env.ETHERSCAN_API_KEY }}\n      eventTime:\n        kind: FromMetadata\n    prepare:\n    - kind: Pipe\n      command:\n      - jq\n      - -c\n      - .result[]\n    - kind: Decompress\n      format: zip\n    read:\n      kind: Json\n      schema:\n      - blockNumber STRING\n      - timeStamp STRING\n      - hash STRING\n      - nonce STRING\n      - blockHash STRING\n      - transactionIndex STRING\n      - from STRING\n      - to STRING\n      - value STRING\n      - gas STRING\n      - gasPrice STRING\n      - isError STRING\n      - txreceipt_status STRING\n      - input STRING\n      - contractAddress STRING\n      - cumulativeGasUsed STRING\n      - gasUsed STRING\n      - confirmations STRING\n      dateFormat: yyyy-MM-dd\n      encoding: UTF-8\n      timestampFormat: yyyy-MM-dd'T'HH:mm:ss[.SSS][XXX]\n    preprocess:\n      kind: Sql\n      engine: spark\n      queries:\n      - alias: account.transactions\n        query: |\n          SELECT\n            cast(cast(timeStamp as bigint) as timestamp) as block_time,\n            cast(blockNumber as bigint) as block_number,\n            blockHash as block_hash,\n            'eth' as symbol,\n            hash as transaction_hash,\n            transactionIndex as transaction_index,\n            nonce,\n            from,\n            to,\n            value,\n            input,\n            isError,\n            txreceipt_status,\n            contractAddress as contract_address,\n            gas,\n            gasPrice as gas_price,\n            gasUsed as gas_used,\n            cumulativeGasUsed as cumulative_gas_used,\n            confirmations\n          FROM input\n    merge:\n      kind: Ledger\n      primaryKey:\n      - transaction_hash\n";

export const mockSetPollingSourceEventYamlWithQuery =
    "kind: MetadataBlock\nversion: 2\ncontent:\n  systemTime: 2023-07-04T18:55:54.589816635Z\n  prevBlockHash: zW1g6av77Pa7eveCF42CLnyY6GD8KpekarcA6KZtVgr52FR\n  sequenceNumber: 1\n  event:\n    kind: setPollingSource\n    fetch:\n      kind: url\n      url: https://api.etherscan.io/api?module=account&action=txlist&address=0xeadb3840596cabf312f2bc88a4bb0b93a4e1ff5f&page=1&offset=1000&startblock=0&endblock=99999999&apikey=${{ env.ETHERSCAN_API_KEY }}\n    prepare:\n    - kind: pipe\n      command:\n      - jq\n      - -c\n      - .result[]\n    read:\n      kind: jsonLines\n      schema:\n      - blockNumber STRING\n      - timeStamp STRING\n      - hash STRING\n      - nonce STRING\n      - blockHash STRING\n      - transactionIndex STRING\n      - from STRING\n      - to STRING\n      - value STRING\n      - gas STRING\n      - gasPrice STRING\n      - isError STRING\n      - txreceipt_status STRING\n      - input STRING\n      - contractAddress STRING\n      - cumulativeGasUsed STRING\n      - gasUsed STRING\n      - confirmations STRING\n    preprocess:\n      kind: sql\n      engine: spark\n      query: |\n        SELECT\n          cast(cast(timeStamp as bigint) as timestamp) as block_time,\n          cast(blockNumber as bigint) as block_number,\n          blockHash as block_hash,\n          'eth' as symbol,\n          hash as transaction_hash,\n          transactionIndex as transaction_index,\n          nonce,\n          from,\n          to,\n          value,\n          input,\n          isError,\n          txreceipt_status,\n          contractAddress as contract_address,\n          gas,\n          gasPrice as gas_price,\n          gasUsed as gas_used,\n          cumulativeGasUsed as cumulative_gas_used,\n          confirmations\n        FROM input\n    merge:\n      kind: ledger\n      primaryKey:\n      - transaction_hash\n";

export const mockSetPollingSourceEventYamlWithoutPreprocess =
    "kind: MetadataBlock\nversion: 2\ncontent:\n  systemTime: 2023-07-19T11:32:40.032474125Z\n  prevBlockHash: zW1a24AfmasmU3nLWDgfTKUdrQuiWZkqzNP2A4hQMumRNX4\n  sequenceNumber: 4\n  event:\n    kind: setPollingSource\n    fetch:\n      kind: url\n      url: https://api.etherscan.io/api?module=account&action=txlist&address=0xeadb3840596cabf312f2bc88a4bb0b93a4e1ff5f&page=1&offset=1000&startblock=0&endblock=99999999&apikey=${{ env.ETHERSCAN_API_KEY }}\n      eventTime:\n        kind: fromMetadata\n    prepare:\n    - kind: pipe\n      command:\n      - jq\n      - -c\n      - .result[]\n    - kind: decompress\n      format: zip\n    read:\n      kind: jsonLines\n      schema:\n      - blockNumber STRING\n      - timeStamp STRING\n      - hash STRING\n      - nonce STRING\n      - blockHash STRING\n      - transactionIndex STRING\n      - from STRING\n      - to STRING\n      - value STRING\n      - gas STRING\n      - gasPrice STRING\n      - isError STRING\n      - txreceipt_status STRING\n      - input STRING\n      - contractAddress STRING\n      - cumulativeGasUsed STRING\n      - gasUsed STRING\n      - confirmations STRING\n      dateFormat: yyyy-MM-dd\n      encoding: UTF-8\n      timestampFormat: yyyy-MM-dd'T'HH:mm:ss[.SSS][XXX]\n    merge:\n      kind: ledger\n      primaryKey:\n      - transaction_hash\n";

export const mockAddPushSourceYaml =
    "kind: MetadataBlock\nversion: 2\ncontent:\n  systemTime: 2025-03-03T19:50:34.264304224Z\n  prevBlockHash: f1620bda57668ffb76225887f605e0191f0af3c9898b512ba2cc3dffac96cd4036087\n  sequenceNumber: 1\n  event:\n    kind: AddPushSource\n    sourceName: dsadasdsfsdfsdf\n    read:\n      kind: Csv\n      separator: ','\n      encoding: utf8\n      quote: '\"'\n      escape: \\\n      dateFormat: rfc3339\n      timestampFormat: rfc3339\n    merge:\n      kind: Append\n";
