package com.gestion.orphelins.validation;

public class NotFoundExceptionHndler  extends  RuntimeException{
    public NotFoundExceptionHndler(String message){
        super(message);
    }
}
