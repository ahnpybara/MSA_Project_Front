import React, { Component } from "react";

export default class Constant{
    static serviceURL="http://localhost:8080"; 

    static getEmailMenus() {
        return [
            { key: 0, value: "naver.com" },
            { key: 1, value: "gmail.com" },
            { key: 2, value: "nate.com" },
            { key: 3, value: "hanmail.com" },

        ];
    }
}