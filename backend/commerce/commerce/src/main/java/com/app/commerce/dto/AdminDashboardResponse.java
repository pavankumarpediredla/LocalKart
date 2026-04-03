package com.app.commerce.dto;

import java.util.List;

public class AdminDashboardResponse {

	private List<AdminStatResponse> stats;
	private List<SupportTicketResponse> supportTickets;
	private List<AccountInfoResponse> accountInfo;
	private List<CustomerSegmentResponse> customerSegments;
	private List<Integer> analytics;

	public AdminDashboardResponse() {
	}

	public AdminDashboardResponse(List<AdminStatResponse> stats, List<SupportTicketResponse> supportTickets,
			List<AccountInfoResponse> accountInfo, List<CustomerSegmentResponse> customerSegments, List<Integer> analytics) {
		this.stats = stats;
		this.supportTickets = supportTickets;
		this.accountInfo = accountInfo;
		this.customerSegments = customerSegments;
		this.analytics = analytics;
	}

	public List<AdminStatResponse> getStats() {
		return stats;
	}

	public void setStats(List<AdminStatResponse> stats) {
		this.stats = stats;
	}

	public List<SupportTicketResponse> getSupportTickets() {
		return supportTickets;
	}

	public void setSupportTickets(List<SupportTicketResponse> supportTickets) {
		this.supportTickets = supportTickets;
	}

	public List<AccountInfoResponse> getAccountInfo() {
		return accountInfo;
	}

	public void setAccountInfo(List<AccountInfoResponse> accountInfo) {
		this.accountInfo = accountInfo;
	}

	public List<CustomerSegmentResponse> getCustomerSegments() {
		return customerSegments;
	}

	public void setCustomerSegments(List<CustomerSegmentResponse> customerSegments) {
		this.customerSegments = customerSegments;
	}

	public List<Integer> getAnalytics() {
		return analytics;
	}

	public void setAnalytics(List<Integer> analytics) {
		this.analytics = analytics;
	}
}
