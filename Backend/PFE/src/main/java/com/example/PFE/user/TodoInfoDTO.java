package com.example.PFE.user;

public class TodoInfoDTO {
    private Long id;
    private String groupName;
    private String title;
    private String description;
    private String firstName;
    private String lastName;

    public TodoInfoDTO(Long id, String groupName, String title, String description, String firstName, String lastName) {
        this.id = id;
        this.groupName = groupName;
        this.title = title;
        this.description = description;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
}
