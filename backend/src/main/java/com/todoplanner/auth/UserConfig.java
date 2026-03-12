package com.todoplanner.auth;

import jakarta.persistence.*;

@Entity
@Table(name = "user_config")
public class UserConfig {

    @Id
    private Long id = 1L;

    @Column(name = "pin_hash")
    private String pinHash;

    @Column(name = "refresh_token_hash")
    private String refreshTokenHash;

    public UserConfig() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPinHash() { return pinHash; }
    public void setPinHash(String pinHash) { this.pinHash = pinHash; }

    public String getRefreshTokenHash() { return refreshTokenHash; }
    public void setRefreshTokenHash(String refreshTokenHash) { this.refreshTokenHash = refreshTokenHash; }
}
