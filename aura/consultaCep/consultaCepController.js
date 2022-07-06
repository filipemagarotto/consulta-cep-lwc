({
    doInit : function(component, event, helper){  
        let recordId = component.get("v.recordId")
        console.log(recordId)
    },

    getValueFromLwc : function(component, event, helper) {
		$A.get("e.force:closeQuickAction").fire()
	}
})