/*
 * Copyright 2010-2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

package bmw.car.api;

import java.util.*;

import bmw.car.api.model.Empty;


@com.amazonaws.mobileconnectors.apigateway.annotation.Service(endpoint = "https://bmw.hackathons.denull")
public interface ConnecteddriveapiClient {


    /**
     * A generic invoker to invoke any API Gateway endpoint.
     * @param request
     * @return ApiResponse
     */
    com.amazonaws.mobileconnectors.apigateway.ApiResponse execute(com.amazonaws.mobileconnectors.apigateway.ApiRequest request);
    
    /**
     * 
     * 
     * @return Empty
     */
    @com.amazonaws.mobileconnectors.apigateway.annotation.Operation(path = "/", method = "GET")
    Empty rootGet();
    
    /**
     * 
     * 
     * @return Empty
     */
    @com.amazonaws.mobileconnectors.apigateway.annotation.Operation(path = "/", method = "OPTIONS")
    Empty rootOptions();
    
    /**
     * 
     * 
     * @return Empty
     */
    @com.amazonaws.mobileconnectors.apigateway.annotation.Operation(path = "/schema/swagger.json", method = "GET")
    Empty schemaSwaggerJsonGet();
    
    /**
     * 
     * 
     * @return Empty
     */
    @com.amazonaws.mobileconnectors.apigateway.annotation.Operation(path = "/schema/swagger.json", method = "OPTIONS")
    Empty schemaSwaggerJsonOptions();
    
    /**
     * 
     * 
     * @return Empty
     */
    @com.amazonaws.mobileconnectors.apigateway.annotation.Operation(path = "/vehicles", method = "GET")
    Empty vehiclesGet();
    
    /**
     * 
     * 
     * @return Empty
     */
    @com.amazonaws.mobileconnectors.apigateway.annotation.Operation(path = "/vehicles", method = "OPTIONS")
    Empty vehiclesOptions();
    
    /**
     * 
     * 
     * @param id 
     * @return Empty
     */
    @com.amazonaws.mobileconnectors.apigateway.annotation.Operation(path = "/vehicles/{id}", method = "GET")
    Empty vehiclesIdGet(
            @com.amazonaws.mobileconnectors.apigateway.annotation.Parameter(name = "id", location = "path")
            String id);
    
    /**
     * 
     * 
     * @return Empty
     */
    @com.amazonaws.mobileconnectors.apigateway.annotation.Operation(path = "/vehicles/{id}", method = "OPTIONS")
    Empty vehiclesIdOptions();
    
    /**
     * 
     * 
     * @param id 
     * @return Empty
     */
    @com.amazonaws.mobileconnectors.apigateway.annotation.Operation(path = "/vehicles/{id}/destinations", method = "GET")
    Empty vehiclesIdDestinationsGet(
            @com.amazonaws.mobileconnectors.apigateway.annotation.Parameter(name = "id", location = "path")
            String id);
    
    /**
     * 
     * 
     * @return Empty
     */
    @com.amazonaws.mobileconnectors.apigateway.annotation.Operation(path = "/vehicles/{id}/destinations", method = "OPTIONS")
    Empty vehiclesIdDestinationsOptions();
    
    /**
     * 
     * 
     * @param id 
     * @return Empty
     */
    @com.amazonaws.mobileconnectors.apigateway.annotation.Operation(path = "/vehicles/{id}/poi", method = "POST")
    Empty vehiclesIdPoiPost(
            @com.amazonaws.mobileconnectors.apigateway.annotation.Parameter(name = "id", location = "path")
            String id);
    
    /**
     * 
     * 
     * @return Empty
     */
    @com.amazonaws.mobileconnectors.apigateway.annotation.Operation(path = "/vehicles/{id}/poi", method = "OPTIONS")
    Empty vehiclesIdPoiOptions();
    
    /**
     * 
     * 
     * @param id 
     * @return Empty
     */
    @com.amazonaws.mobileconnectors.apigateway.annotation.Operation(path = "/vehicles/{id}/services", method = "GET")
    Empty vehiclesIdServicesGet(
            @com.amazonaws.mobileconnectors.apigateway.annotation.Parameter(name = "id", location = "path")
            String id);
    
    /**
     * 
     * 
     * @return Empty
     */
    @com.amazonaws.mobileconnectors.apigateway.annotation.Operation(path = "/vehicles/{id}/services", method = "OPTIONS")
    Empty vehiclesIdServicesOptions();
    
    /**
     * 
     * 
     * @param serviceType 
     * @param id 
     * @return Empty
     */
    @com.amazonaws.mobileconnectors.apigateway.annotation.Operation(path = "/vehicles/{id}/services/{serviceType}", method = "GET")
    Empty vehiclesIdServicesServiceTypeGet(
            @com.amazonaws.mobileconnectors.apigateway.annotation.Parameter(name = "serviceType", location = "path")
            String serviceType,
            @com.amazonaws.mobileconnectors.apigateway.annotation.Parameter(name = "id", location = "path")
            String id);
    
    /**
     * 
     * 
     * @return Empty
     */
    @com.amazonaws.mobileconnectors.apigateway.annotation.Operation(path = "/vehicles/{id}/services/{serviceType}", method = "OPTIONS")
    Empty vehiclesIdServicesServiceTypeOptions();
    
    /**
     * 
     * 
     * @param serviceType 
     * @param id 
     * @return Empty
     */
    @com.amazonaws.mobileconnectors.apigateway.annotation.Operation(path = "/vehicles/{id}/services/{serviceType}/status", method = "GET")
    Empty vehiclesIdServicesServiceTypeStatusGet(
            @com.amazonaws.mobileconnectors.apigateway.annotation.Parameter(name = "serviceType", location = "path")
            String serviceType,
            @com.amazonaws.mobileconnectors.apigateway.annotation.Parameter(name = "id", location = "path")
            String id);
    
    /**
     * 
     * 
     * @return Empty
     */
    @com.amazonaws.mobileconnectors.apigateway.annotation.Operation(path = "/vehicles/{id}/services/{serviceType}/status", method = "OPTIONS")
    Empty vehiclesIdServicesServiceTypeStatusOptions();
    
}

