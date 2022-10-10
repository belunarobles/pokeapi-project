public with sharing class SearchWrapper {
    @AuraEnabled
    public String searchName { get; set; }
    @AuraEnabled
    public String filterTypes { get; set; }
    @AuraEnabled
    public String filterGeneration { get; set; }

    public SearchWrapper() {
        this.searchName = '';
        this.filterTypes = '';
        this.filterGeneration = '';
    }
}
