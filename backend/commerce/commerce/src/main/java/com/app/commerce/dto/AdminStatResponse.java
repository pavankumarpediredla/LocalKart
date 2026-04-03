package com.app.commerce.dto;

public class AdminStatResponse {

	private String label;
	private String value;
	private String detail;

	public AdminStatResponse() {
	}

	public AdminStatResponse(String label, String value, String detail) {
		this.label = label;
		this.value = value;
		this.detail = detail;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getDetail() {
		return detail;
	}

	public void setDetail(String detail) {
		this.detail = detail;
	}
}
