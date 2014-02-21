grouping-annotator
==================

Plug-in for Annotator tool that checks when annotations are created in the same line and replaces it with a marker and number for annotations in that line.

#Installation

To use the tool you need to install the [Annotator plugin](https://github.com/okfn/annotator/) to annotate text.

In addition, add grouping-annotator.min.js and grouping-annotator.min.css CDN distributed file to your head tag, like this:

```html
	<head>
		<!-- Annotator -->
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js"></script>
		<script src="http://assets.annotateit.org/annotator/v1.2.7/annotator-full.min.js"></script>
		<link rel="stylesheet" href="http://assets.annotateit.org/annotator/v1.2.7/annotator.min.css">

		<!-- Grouping Plug-in -->
		<script src="src/grouping-annotator.js"></script>
		<link href="src/grouping-annotator.css" rel="stylesheet">
	
	</head>
```

Furthermore, you will need to create an instance of Annotator with the plugin, as follow:

```js
	<script>
		var 
    	var optionsgroup = {
    		threshold:2
		};
    	$('#div_id').annotator().annotator('addPlugin','Grouping',optionsgroup);
    </script>
```

Change #div_id for the real id where the Annotator is and "optionsdiacritic" should include the threshold number of annotators per line that will cause the grouping mechanism to be in place. If you'd like to disable the plug-in, pass in "-1" as threshold.
