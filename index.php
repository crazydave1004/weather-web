<?php
        $a=0;
        $street="";
        while (stripos($_REQUEST["streetAddress"]," ",$a)>0){
            $po=stripos($_REQUEST["streetAddress"]," ",$a);
            $street.=substr($_REQUEST["streetAddress"],$a,$po-$a)."+";
            $a=$po+1;
        }
        $street.=substr($_REQUEST["streetAddress"],$a);
        $b=0;
        $cities="";
        while (stripos($_REQUEST["cities"]," ",$b)>0){
            $po=stripos($_REQUEST["cities"]," ",$b);
            $cities.=substr($_REQUEST["cities"],$b,$po-$b)."+";
            $b=$po+1;
        }
        $cities.=substr($_REQUEST["cities"],$b);
        $url1 = "https://maps.googleapis.com/maps/api/geocode/xml?address=".$street.",".$cities.",".$_REQUEST["states"]."&key=AIzaSyAX3iF0QoN_YWnQoNgzHBAubaNOHzsShPA";
        $xml=simplexml_load_file($url1);
        if (isset($xml->result)){
        $latitude=$xml->result[0]->geometry->location->lat;
        $longitude=$xml->result[0]->geometry->location->lng;
        }
        $url2 = "https://api.forecast.io/forecast/00d0e7e2e3b3ad2421e7a3c7cef60b0e/".$latitude.",".$longitude."?units=".$_REQUEST["degree"]."&exclude=flags";
        $js_obj=file_get_contents($url2);
        echo $js_obj;
?>
