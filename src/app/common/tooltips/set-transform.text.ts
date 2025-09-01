/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

export class SetTransformTooltipsTexts {
    public static readonly ENGINE = "Identifier of the engine used for this transformation.";
    public static readonly QUERIES = "Queries use for specifying multi-step SQL transformations.";
    public static readonly TEMPORAL_TABLES =
        "Temporary Flink-specific extension for creating temporal tables from streams.";
    public static readonly DATASET_ID = "Unique dataset identifier.";
    public static readonly DATASET_ID_PRIVATE = "Unique dataset identifier. Dataset is private.";
    public static readonly DATASET_KIND = "Type of the dataset.";
    public static readonly DATASET_VISIBILITY = "Visibility of the dataset.";
    public static readonly DATASET_NAME = "Name of the dataset.";
    public static readonly DATASET_OWNER = "Owner of the dataset.";
    public static readonly DATASET_ALIAS = "Query alias of the dataset.";
    public static readonly DATASET_REF = "A local or remote dataset reference to use in dataset resolutions.";
    public static readonly DATASET_NOT_ACCESSIBLE = "Dataset accessibility";
    public static readonly DATASET_SUMMARY = "Summary of the dataset";
}
