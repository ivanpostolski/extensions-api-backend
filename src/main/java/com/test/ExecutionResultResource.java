package com.test;

import com.google.common.base.Optional;
import org.mule.extensions.execution.ExecutionResult;


public class ExecutionResultResource {

    private String result;
    public ExecutionResult.Status status;
    private String exception;

    public ExecutionResultResource(ExecutionResult executionResult) {
        this.status = executionResult.getStatus();
        //SUCCESS scenario
        if (executionResult.getStatus().equals(ExecutionResult.Status.SUCCESS)){
            Optional<Object> objectOptional = executionResult.get();
            if (objectOptional.isPresent()){
                Object concreteResult = objectOptional.get();
                this.result = concreteResult.toString();
            }
        } else{ //FAILURE scenario
            Optional<Exception> exceptionOptional = executionResult.getException();
            if (exceptionOptional.isPresent()){
                Exception exception = exceptionOptional.get();
                this.exception = exception.getMessage();
            }
        }
    }

    public ExecutionResult.Status getStatus() {
        return status;
    }

    public String getResult() {
        return result;
    }

    public String getException() {
        return exception;
    }
}
