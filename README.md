# SuccessFactors - API Proxy - Package

[![Eclipse License](http://img.shields.io/badge/license-Eclipse-brightgreen.svg)](LICENSE)
[![GitHub contributors](https://img.shields.io/github/contributors/dirigiblelabs/successfactors-api-proxy-package.svg)](https://github.com/dirigiblelabs/successfactors-api-proxy-package/graphs/contributors)

## Overview

SuccessFactors API Proxy - Package


## Setup

- To update the application (modules) content use the following command:
    ```
    mvn clean install -P content
    ```
- To build an application package (ROOT.war) use the following command:
    ```
    mvn clean install -Djava.version=8
    ```
- To build an application package for MTA ([Multitarget Application](https://help.sap.com/viewer/ea72206b834e4ace9cd834feed6c0e09/Cloud/en-US/f1caa871360c40e7be7ce4264ab9c336.html) - *.mtar) use the following command:
    ```
    mvn clean install -P mta
    ```
    > ***Note:** Before executing the MTA package command, the Java version should be set to Java 8*

- To change the home page URL change the `DIRIGIBLE_HOME_URL` property at [package/src/main/resources/dirigible.properties](https://github.com/dirigiblelabs/successfactors-api-proxy-package/blob/master/package/src/main/resources/dirigible.properties)

> ***Note:** This package is based on the [sap-all-ephemeral](https://github.com/eclipse/dirigible/tree/master/releng/sap-all-ephemeral) build*

## License

This project is copyrighted by [SAP SE](http://www.sap.com/) and is available under the [Eclipse Public License v 2.0](https://www.eclipse.org/legal/epl-v20.html). See [LICENSE](LICENSE) and [NOTICE.txt](NOTICE.txt) for further details.
