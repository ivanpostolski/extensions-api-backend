package com.test;

import org.mule.extensions.execution.ExecutionResult;


public class ExecutionResultResource {

    private ExecutionResult result;
    public ExecutionResultResource(ExecutionResult executionResult) {
        this.result = executionResult;
        this.status = executionResult.getStatus();
    }

    public ExecutionResult.Status getStatus() {
        return status;
    }

    public ExecutionResult.Status status;
}
