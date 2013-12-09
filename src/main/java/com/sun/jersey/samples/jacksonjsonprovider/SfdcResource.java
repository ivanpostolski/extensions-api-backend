package com.sun.jersey.samples.jacksonjsonprovider;

import org.mule.extensions.introspection.MuleExtension;
import org.mule.modules.salesforce.extension.SfdcMuleExtension;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriInfo;


@Path("/sfdc")
public class SfdcResource {

    MuleExtension extension = new SfdcMuleExtension();

    @GET
    @Produces(value = "application/json")
    public MuleExtensionResource getConfigs(@Context UriInfo ui){
           return new MuleExtensionResource(extension);
    }

    @Path("/config")
    @Produces(MediaType.APPLICATION_JSON)
    public ConfigurationResource config(){
        return new ConfigurationResource(extension.configurations().get(0));
    }

    @Path("/config-with-oauth")
    @Produces(MediaType.APPLICATION_JSON)
    public ConfigurationResource oauth(){
        return new ConfigurationResource(extension.configurations().get(1));
    }


}
