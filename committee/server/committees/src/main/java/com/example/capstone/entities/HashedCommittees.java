package com.example.capstone.entities;

import java.util.HashMap;

public class HashedCommittees {
    HashMap<String, Committee> hashMap;

    public void setHashMap(HashMap<String, Committee> hashMap) {
        this.hashMap = hashMap;
    }

    public HashMap<String, Committee> getHashMap() {
        return hashMap;
    }
}
