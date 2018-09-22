REX.HMI.init = function(){
    /* *******************************************************************************************
     *                          WebBuDi - Web Buttons and Displays configuration file
     * *******************************************************************************************
     *
     * WebBuDi is composed from several rows (graphical components with pre-defined 
     * function and look) connected to a single item in control system (specified by 
     * an alias or a cstring property). There are different rows according to the type 
     * they are changing (for boolean, numbers, dates, etc.).
     * All rows are organised in sections (colored blocks which can have a heading).
     * The sections are then organizes in several columns.
     *
     *
     * Available row types:
     *
     * DR - Digital Read
     *      (options:{label_false:'OFF',
     *                label_true:'ON',
     *                reverse_meaning:false,
     *                color_true:'green',
     *                color_false:'red')
     * DW - Digital Write
     * MP - Manual Pulse
     * PB - Push Button
     * AR - Analog Read
     *       ({format:'number' | format:'time' | format:'date' | format:'datetime' | format:'text'})
     * AW - Analog Write
     *       ({format:'number' | format:'time' | format:'date' | format:'datetime' | format:'text'})
     * ALT - Analog Lookup Table (values:{name:value})
     * LINK - Link to different URL
     * ES - Empty Space
     *
     * The example of the row
     * {alias:<alias of the signal>, desc:<displayed name>, cstring:<Connection string>, type:<type of the signal>,
     *  ...other row specific options }
     *
     * !!! ATTENTION It is posible to add items to various sections, but every item must have UNIQUE ALIAS !!!
     */

    /* Uncomment and set if you want to add the WebBuDi components to the different DIV
     * The default value is: 'content' 
     * NOTE: This assigment must be called before any 'addSection' function
     */
     // REX.WebBuDi.customDivID = 'content';
    
    /*
     * This is example how to define connections in one place for all rows
     * the example of the one line is:
     * {alias:<alias of the signal>, cstring:<Connection string>, write: true | false}    
     */ 
	
	//Indicators displaying the status of switches 
	var Civil_Twilight = {
		column: 1,
		title: 'Civil Twilight', 
		rows: [
			{alias: 'CTLBH', desc: 'Begin Hour',
			cstring: 'VAS_LEVEL0_TASK1_TIME.EPHEM_CIVIL_TWILIGHT_A:BEGIN_HOUR', type: 'AR'},
			{alias: 'CTLBM', desc: 'Begin Minute',
			cstring: 'VAS_LEVEL0_TASK1_TIME.EPHEM_CIVIL_TWILIGHT_A:BEGIN_MIN', type: 'AR'},
			{alias: 'CTLBS', desc: 'Begin Second',
			cstring: 'VAS_LEVEL0_TASK1_TIME.EPHEM_CIVIL_TWILIGHT_A:BEGIN_SEC', type: 'AR'},
			{alias: 'CTLEH', desc: 'End Hour',
			cstring: 'VAS_LEVEL0_TASK1_TIME.EPHEM_CIVIL_TWILIGHT_A:END_HOUR', type: 'AR'},
			{alias: 'CTLEM', desc: 'End Minute',
			cstring: 'VAS_LEVEL0_TASK1_TIME.EPHEM_CIVIL_TWILIGHT_A:END_MIN', type: 'AR'},
			{alias: 'CTLES', desc: 'End Second',
			cstring: 'VAS_LEVEL0_TASK1_TIME.EPHEM_CIVIL_TWILIGHT_A:END_SEC', type: 'AR'}
		] 
	}; 
	REX.WebBuDi.addSection(Civil_Twilight);
	
	var SUN_RISE_SET = {
		column: 2,
		title: 'Sun Rise & Set', 
		rows: [
			{alias: 'SRSBH', desc: 'Rise Hour',
			cstring: 'VAS_LEVEL0_TASK1_TIME.EPHEM_SUN_RISE_A:BEGIN_HOUR', type: 'AR'},
			{alias: 'SRSBM', desc: 'Rise Minute',
			cstring: 'VAS_LEVEL0_TASK1_TIME.EPHEM_SUN_RISE_A:BEGIN_MIN', type: 'AR'},
			{alias: 'SRSBS', desc: 'Rise Second',
			cstring: 'VAS_LEVEL0_TASK1_TIME.EPHEM_SUN_RISE_A:BEGIN_SEC', type: 'AR'},
			{alias: 'SRSEH', desc: 'Set Hour',
			cstring: 'VAS_LEVEL0_TASK1_TIME.EPHEM_SUN_RISE_A:END_HOUR', type: 'AR'},
			{alias: 'SRSEM', desc: 'Set Minute',
			cstring: 'VAS_LEVEL0_TASK1_TIME.EPHEM_SUN_RISE_A:END_MIN', type: 'AR'},
			{alias: 'SRSES', desc: 'Set Second',
			cstring: 'VAS_LEVEL0_TASK1_TIME.EPHEM_SUN_RISE_A:END_SEC', type: 'AR'}
		] 
	}; 
	REX.WebBuDi.addSection(SUN_RISE_SET);
	
	//DHT status 
	var DHT = { 
		column: 3, 
		title: 'Temperature & Humidity',
		rows: [
			{alias: 'UVA_TEMP', desc: 'UVA Temperature ',
			cstring: 'VAS_LEVELxTASKx_THT.UVA_TRND:y1', type: 'AR'},
			{alias: 'UVA_HUM', desc: 'UVA Humidity',
			cstring: 'VAS_LEVELxTASKx_THT.UVA_TRND:y2', type: 'AR'},
			{alias: 'UVB_TEMP', desc: 'UVA Temperature', 
			cstring: 'VAS_LEVELxTASKx_THT.UVB_TRND:y1', type: 'AR'},
			{alias: 'UVB_HUM', desc: 'UVA Humidity',
			cstring: 'VAS_LEVELxTASKx_THT.UVB_TRND:y2', type: 'AR'},
			{alias: 'CAVE_TEMP', desc: 'Cave Temperature', 
			cstring: 'VAS_LEVELxTASKx_THT.CAVE_TRND:y1', type: 'AR'},
			{alias: 'CAVE_HUM', desc: 'Cave Humidity',
			cstring: 'VAS_LEVELxTASKx_THT.CAVE_TRND:y2', type: 'AR'}
		]
	};
	REX.WebBuDi.addSection(DHT);

	//Add real-time trend 
	REX.HMI.Graph.addTrend({cstring: 'VAS_LEVELxTASKx_THT.UVA_TRND', labels: ['UVA_TEMP', 'UVA_HUM']});
	//REX.HMI.Graph.setMaxBufferSize(200);
	REX.HMI.Graph.addTrend({cstring: 'VAS_LEVELxTASKx_THT.UVB_TRND', labels: ['UVB_TEMP', 'UVB_HUM']});
	//REX.HMI.Graph.setMaxBufferSize(200);
	REX.HMI.Graph.addTrend({cstring: 'VAS_LEVELxTASKx_THT.CAVE_TRND', labels: ['CAVE_TEMP', 'CAVE_HUM']});
	REX.HMI.Graph.setMaxBufferSize(86400);
	
	/* REX.HMI.Graph - Time-based graph component which is shown on the bottom of the web page.
     * Graph can read arbitrary signal connected via ALIAS and CSTRING or all signals from TRND
     * blocks. 
     * The Graph is shown when first signal is added over `addSignal` or `addTrend` function.
     */
     
    // Add all signals from TRND block with user defined labels
    // REX.HMI.Graph.addTrend({cstring: 'task_name.TRND_name', labels: ['Signal 1','Signal 2','Signal 3','Signal 4']});
    
    /* Add arbitrary signal to graph using ALIAS and CSTRING */
    // REX.HMI.Graph.addSignal({alias:"Graph", cstring:"task_name.block_name:signal", desc:"Signal value", period:1000});
    
    // Adjust size of the trend. Value is in <0;1> interval.
    // It represents the percentage of the visible screen
    // REX.HMI.Graph.setSize(0.39);
    
    // Set different target address
    REX.HMI.setTargetUrl('ws://vas.rfnis.net8080/rex');
    
    // Set refresh rate (Default: 500 ms)
    REX.HMI.setRefreshRate(1000);
    
    // Change title of the page
    REX.HMI.setTitle('VAS');
    
    // Show clock in upper right corner
    REX.HMI.showHeartBeatClock()
	
}
