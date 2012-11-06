<?php 
	
	/*if( $_FILES['image']['error'] === 0 ) {
		echo $_FILES['image']['name'] ;
	}*/

	if( $_FILES['image']['error'] == 0 ) {
		if ( 	($_FILES["image"]["type"] == "image/gif") || ($_FILES["image"]["type"] == "image/jpeg") || 
				($_FILES["image"]["type"] == "image/jpg") || ($_FILES["image"]["type"] == "image/png") || 
				($_FILES["image"]["type"] == "image/pjpeg") ) {

			$imageName = $_FILES['image']['name'] ;
			$tempname = explode('.',$imageName);
			$type = $tempname[1];
			move_uploaded_file($_FILES['image']['tmp_name'],"../upload/" . $imageName);

			echo $imageName ;
		}
	}
?>