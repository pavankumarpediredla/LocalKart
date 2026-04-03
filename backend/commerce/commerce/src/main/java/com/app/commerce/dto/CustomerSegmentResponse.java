package com.app.commerce.dto;

public class CustomerSegmentResponse {

	private String name;
	private String value;
	private String accent;

	public CustomerSegmentResponse() {
	}

	public CustomerSegmentResponse(String name, String value, String accent) {
		this.name = name;
		this.value = value;
		this.accent = accent;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getAccent() {
		return accent;
	}

	public void setAccent(String accent) {
		this.accent = accent;
	}
}
