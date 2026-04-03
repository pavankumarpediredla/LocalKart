package com.app.commerce.dto;

public class SupportTicketResponse {

	private String id;
	private String user;
	private String issue;
	private String priority;

	public SupportTicketResponse() {
	}

	public SupportTicketResponse(String id, String user, String issue, String priority) {
		this.id = id;
		this.user = user;
		this.issue = issue;
		this.priority = priority;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public String getIssue() {
		return issue;
	}

	public void setIssue(String issue) {
		this.issue = issue;
	}

	public String getPriority() {
		return priority;
	}

	public void setPriority(String priority) {
		this.priority = priority;
	}
}
