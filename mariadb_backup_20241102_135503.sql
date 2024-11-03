CREATE TABLE `accommodation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `location_id` int(11) NOT NULL,
  `description` text NOT NULL,
  `address` text NOT NULL,
  `subdistrict_id` int(11) NOT NULL,
  `contact` longtext NOT NULL,
  `interest` text DEFAULT NULL,
  `additional_services` text DEFAULT NULL,
  `activites` text DEFAULT NULL,
  `check_in` text DEFAULT NULL,
  `check_out` text DEFAULT NULL,
  `health` text DEFAULT NULL,
  `date_info` longtext DEFAULT NULL,
  `service_fee` text DEFAULT NULL,
  `images` longtext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `location_id` (`location_id`),
  KEY `subdistrict_id` (`subdistrict_id`),
  CONSTRAINT `accommodation_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `accommodation_ibfk_2` FOREIGN KEY (`subdistrict_id`) REFERENCES `subdistricts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accommodation`
--

LOCK TABLES `accommodation` WRITE;
/*!40000 ALTER TABLE `accommodation` DISABLE KEYS */;
INSERT INTO `accommodation` VALUES
(1,9,'','32/4 ม.3 ต.ห้วยแก้ว อ.แม่ออน จ.เชียงใหม่',1,'{\"line_id\":\"himdoihome\",\"email\":\"himdoi261@gmail.com\",\"tel\":[\"0954483935\"]}','ที่พักแนวโฮมสเตย์ ติดริมน้ำ ลำธาร บรรยากาศดี น่าพัก วิวสวยๆ ตื่นตอนเช้าอากาศสดชื่นเย็นสบาย จิบกาแฟแม่กำปอง นั่งฟังเสียงน้ำตก ที่พักต้นทางหมู่บ้าน บรรยากาศล้อมรอบด้วยภูเขาและลำธาร บริการที่พักสำหรับกลุ่มผู้พักตั้งแต่ 1-2 คนขึ้นไป จนถึงกลุ่มใหญ่ไม่เกิน 30 คนมีทั้งแบบห้องและแบบเป็นหลัง มีบริการอาหารเช้า และหมูกะทะยามเย็น','อาหารเช้า ห้องพัดลม บรรยากาศเย็นสบายตลอดปี โถงนั่งเล่นและมินิบาร์ในตัวบ้าน โต๊ะริมน้ำเปลญวณข้างลำธาร น้ำเย็นสบาย ลงเล่นน้ำได้ตลอดทั้งปี','-ท่องเที่ยวตลาดถนนคนเดินใจกลางหมู่บ้าน\r\n-กิ่วฝิ่นพระอาทิตย์ยามเช้า\r\n- ชมโบสถ์กลางน้ำ วิหารไม้เก่า ด้วยอากาศที่ชื้นตลอดทั้งปีทำให้มีมอสขึ้นเต็มหลังคาและมีกล้วยไม้ป่า\r\n- ร้านกาแฟ ชมแหล่งปลูกกาแฟอาราบิก้าสายพันธุ์ดี','13:00','11:00','บรรยากาศปลอดโปร่ง โล่งสบาย ดีต่อปอด ดีต่อใจ เหมาะกับคนที่ต้องการพักผ่อนเงียบสงบดูดดื่มกับธรรมชาติมากที่สุด พร้อมกิจกรรมเพื่อสุขภาพตามวิถีชีวิตและภูมิปัญญาพื้นบ้านชาวสวนเมี่ยง','{\"text\":\"ทุกวัน\"}','ชื่อห้องพักแบบที่ 1 ฮิมดอยโฮม 1 – ห้องเล็ก Standard room สำหรับ 2 ท่าน\nชื่อห้องพักแบบที่ 2 ฮิมดอยโฮม 2 – ห้องใหญ่ Superior room สำหรับ 4 ท่าน\nชื่อห้องพักแบบที่ 3 ฮิมดอยโฮม 3 Cottage style สำหรับ 8 ท่าน\nชื่อห้องพักแบบที่ 4 ฮิมดอยโฮม 4 Villa Style สำหรับ 10 ท่าน\nราคาเริ่มต้น 650 บาท/คน',NULL,'2024-10-30 21:52:16',NULL);
/*!40000 ALTER TABLE `accommodation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attractions`
--

DROP TABLE IF EXISTS `attractions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attractions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `location_id` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `address` text NOT NULL,
  `subdistrict_id` int(11) NOT NULL,
  `contact` longtext NOT NULL,
  `interest` text DEFAULT NULL,
  `product` text DEFAULT NULL,
  `activites` text DEFAULT NULL,
  `health` text DEFAULT NULL,
  `date_info` longtext DEFAULT NULL,
  `service_fee` text DEFAULT NULL,
  `images` longtext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `location_id` (`location_id`),
  KEY `subdistrict_id` (`subdistrict_id`),
  CONSTRAINT `attractions_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attractions_ibfk_2` FOREIGN KEY (`subdistrict_id`) REFERENCES `subdistricts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attractions`
--

LOCK TABLES `attractions` WRITE;
/*!40000 ALTER TABLE `attractions` DISABLE KEYS */;
INSERT INTO `attractions` VALUES
(2,13,'','1 ม.7 ต.บ้านสหกรณ์ อ.แม่ออน จ.เชียงใหม่ 50130',4,'{\"line_id\":\"skp-hotspring\",\"tel\":[\"0876591791\",\"053037101 ต่อ 2\"]}','น้ำพุร้อนที่เกิดจากพลังงานความร้อนใต้พิภพ แบบไกเซอร์ เป็นบ่อน้ำพุร้อนตามธรรมชาติที่ชาวบ้านในพื้นที่ใกล้เคียงใช้ต้มพืชผักที่เก็บจากป่าและรักษาโรคผิวหนัง ช่วยให้ร่างกายผ่อนคลาย กระชุ่มกระชวย ลดความเครียดทั้งร่างกายและจิตใจ บรรเทาอาการปวดเมื่อยของกล้ามเนื้อ สามารถต้มไข่ได้ทั้งแบบไข่ลวก ไข่ยางมะตูม และไข่ต้มสุก','ลักษณะของน้ำพุร้อนสันกำแพง เป็นแบบไกเซอร์ มีระดับอุณหภูมิจากใต้ดิน 105 องศาเซลเซียส พุ่งสูงขึ้นมากกว่า 10 เมตร\nนอกจากนี้ยังมีบริการร้านอาหาร ชากาแฟ บริการต้มไข่ นวดแผนไทย และผลิตภัณฑ์ชุมชนจำหน่าย','บริการสระแช่เท้า (ฟรี)\nบริการสระว่ายน้ำแร่เด็ก (10 บาท/ท่าน)\nบริการสระน้ำแร่กลางแจ้ง (500 บาท/ชั่วโมง)\nบริการแช่อาบน้ำแร่ส่วนตัว (65 บาท/ท่าน)\nบริการสระว่ายน้ำแร่รวม\nบริการห้องพักและสิ่งอำนวยความสะดวก','ช่วยรักษาโรคเกี่ยวกับหลอดเลือดดำ การอักเสบในหลอดลม อาการปวดตามข้อ\nช่วยทำให้กระดูกแข็งแรง\nช่วยรักษาสมดุลของน้ำในร่างกาย\nช่วยบำบัดรักษาผิวหนัง\nช่วยการไหลเวียนโลหิต','{\"text\":\"ทุกวัน\",\"start\":\"07:00\",\"end\":\"18:00\"}','ผู้ใหญ่ไทย 40 บาท\nเด็กไทย 20 บาท\nชาวต่างชาติ: ผู้ใหญ่ 100 บาท, เด็ก 50 บาท\nผู้สูงอายุ/ผู้พิการ (แสดงบัตร) 20 บาท/ฟรี\nจอดรถ 40 บาท/คัน','[\"https://hotspring.noitaemark.com/web/public/uploads/gallery/98/thumbnail/gallery_165104042999248.jpg\", \"https://hotspring.noitaemark.com/web/public/uploads/gallery/92/thumbnail/gallery_165104034794204.jpg\"]','2024-10-30 17:35:15',NULL),
(3,14,'','ต.ห้วยแก้ว อ.แม่ออน จ.เชียงใหม่',1,'{\"tel\":[\"0936891084\"]}','ที่ประดิษฐานองค์ท้าวเวสสุวรรณ สายมูมาสักการะขอพร ขอความสำเร็จ ตกแต่งสไตล์ศาลเจ้าญี่ปุ่น มีคาเฟ่สวยเก๋ตกแต่งในสไตล์แบบญี่ปุ่น บริเวณด้านในกว้างขวาง สวยงาม เงียบสงบ มีความร่มรื่นของต้นไม้','สักการะบูชาขอพร ขอความสำเร็จจากองค์ท้าวเวสสุวรรณ','สายมูมาสักการะบูชาขอพร ขอความสำเร็จจากองค์ท้าวเวสสุวรรณ สงบจิตใจ','ได้สมาธิ เงียบสงบ ผ่อนคลายสภาพจิตใจ','{\"text\":\"ทุกวัน\",\"start\":\"08:00\",\"end\":\"17:00\"}','ค่าผ่านประตู 50 บาท พร้อมชุดบูชาท่าวเวสสุวรรณและคูปองเครื่องดื่มหรือก๋วยเตี๋ยว',NULL,'2024-10-30 17:35:52',NULL),
(4,15,'','บ้านแม่กำปอง ต.ห้วยแก้ว อ.แม่ออน',1,'{\"tel\":[\"0987526180\",\"0624235385\"]}','หมู่บ้านแม่กำปอง หมู่บ้านเล็กๆในหุบเขา สูงจากระดับน้ำทะเลประมาณ 1,300 เมตร ท่ามกลางธรรมชาติ มีต้นไม้ ลำธาร น้ำตก มีอุโบสถหลังเล็กๆตั้งอยู่กลางธารน้ำ','อุโบสถกลางน้ำ, วัดคันธาพฤกษา, น้ำตกแม่กำปอง, ถนนคนเดิน, ศูนย์เรียนรู้, โฮมสเตย์, กิ่วฝิ่น, โครงการหลวงตีนตก, ผลิตภัณฑ์ชุมชน, กาแฟอาราบิก้า, อาหารและขนมพื้นบ้าน','ท่องเที่ยวธรรมชาติ, เยี่ยมชมวัด, ชมน้ำตก, ช้อปปิ้งถนนคนเดิน, พักโฮมสเตย์, ชมวิวทะเลหมอก','ฟื้นฟูร่างกายและจิตใจ สูดอากาศบริสุทธิ์','{\"text\":\"ทุกวัน\"}','ไม่มีค่าบริการ',NULL,'2024-10-30 17:36:14',NULL);
/*!40000 ALTER TABLE `attractions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bookings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `booking_details` longtext NOT NULL,
  `booking_date` date NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `people` int(11) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` enum('PENDING','CONFIRMED','CANCELLED','COMPLETED') NOT NULL DEFAULT 'PENDING',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES
(36,1,'[{\"program_id\":1,\"program_name\":\"ผ่อนคลาย \\\"วิถีชีวิตแม่กำปอง\\\" และออนแซน\",\"date\":\"2024-11-03\",\"schedules\":\"[{\\\"day\\\":1,\\\"title\\\":\\\"ผ่อนคลายวิถีชีวิตแม่กำปอง\\\",\\\"activities\\\":[{\\\"sequence\\\":1,\\\"start_time\\\":\\\"09:00:00\\\",\\\"end_time\\\":\\\"10:00:00\\\",\\\"activity\\\":\\\"Check-In และตรวจสุขภาพ\\\",\\\"description\\\":\\\"เจาะเลือด วัดความดัน เช็คค่าน้ำตาลในเลือด\\\",\\\"location_id\\\":8,\\\"location_name\\\":\\\"โรงพยาบาลแม่ออน\\\",\\\"location_type\\\":\\\"hospital\\\",\\\"cost\\\":50,\\\"included_in_total_price\\\":true,\\\"is_mandatory\\\":true,\\\"isComplete\\\":false},{\\\"sequence\\\":2,\\\"start_time\\\":\\\"10:00:00\\\",\\\"end_time\\\":\\\"12:00:00\\\",\\\"activity\\\":\\\"กิจกรรมศูนย์เรียนรู้\\\",\\\"description\\\":\\\"ชมธรรมชาติ วิถีชีวิตชุมชนแม่กำปอง และรับบริการย่างแคร่/นวดแผนโบราณ\\\",\\\"location_id\\\":16,\\\"location_name\\\":\\\"ศูนย์เรียนรู้แม่กำปอง\\\",\\\"location_type\\\":\\\"learning_resources\\\",\\\"services\\\":[\\\"ย่างแคร่\\\",\\\"นวดแผนโบราณ\\\"],\\\"cost\\\":200,\\\"included_in_total_price\\\":true,\\\"isComplete\\\":false},{\\\"sequence\\\":3,\\\"start_time\\\":\\\"12:00:00\\\",\\\"end_time\\\":\\\"13:30:00\\\",\\\"activity\\\":\\\"เรียนทำอาหารพื้นเมือง\\\",\\\"description\\\":\\\"เรียนรู้การทำยำใบเมี่ยง ไข่ป่าม\\\",\\\"location_id\\\":2,\\\"location_name\\\":\\\"ยำใบเมี่ยง\\\",\\\"location_type\\\":\\\"learning_resources\\\",\\\"cost\\\":200,\\\"included_in_total_price\\\":true,\\\"isComplete\\\":false},{\\\"sequence\\\":4,\\\"start_time\\\":\\\"13:30:00\\\",\\\"end_time\\\":\\\"14:30:00\\\",\\\"activity\\\":\\\"ท่องเที่ยวแม่กำปอง\\\",\\\"description\\\":\\\"เที่ยวน้ำตก วัดคันธาพฤกษา และถนนคนเดิน\\\",\\\"location_id\\\":15,\\\"location_name\\\":\\\"ชุมชนแม่กำปอง\\\",\\\"location_type\\\":\\\"attractions\\\",\\\"locations\\\":[{\\\"id\\\":3,\\\"name\\\":\\\"น้ำตกแม่กำปอง\\\",\\\"type\\\":\\\"attractions\\\"},{\\\"id\\\":4,\\\"name\\\":\\\"วัดคันธาพฤกษา\\\",\\\"type\\\":\\\"attractions\\\"},{\\\"id\\\":5,\\\"name\\\":\\\"ถนนคนเดินแม่กำปอง\\\",\\\"type\\\":\\\"attractions\\\"}],\\\"cost\\\":0,\\\"included_in_total_price\\\":false,\\\"note\\\":\\\"ไม่มีค่าใช้จ่าย\\\",\\\"isComplete\\\":false},{\\\"sequence\\\":5,\\\"start_time\\\":\\\"14:30:00\\\",\\\"end_time\\\":\\\"15:30:00\\\",\\\"activity\\\":\\\"เดินทางไปน้ำพุร้อน\\\",\\\"description\\\":\\\"เดินทางไปน้ำพุร้อนสันกำแพง\\\",\\\"cost\\\":0,\\\"included_in_total_price\\\":false,\\\"isComplete\\\":false},{\\\"sequence\\\":6,\\\"start_time\\\":\\\"15:30:00\\\",\\\"end_time\\\":\\\"17:00:00\\\",\\\"activity\\\":\\\"แช่น้ำพุร้อน\\\",\\\"description\\\":\\\"ชมและแช่น้ำพุร้อนสันกำแพง\\\",\\\"location_id\\\":13,\\\"location_name\\\":\\\"น้ำพุร้อนสันกำแพง\\\",\\\"location_type\\\":\\\"attractions\\\",\\\"cost\\\":100,\\\"included_in_total_price\\\":false,\\\"note\\\":\\\"ชำระเงินที่สถานที่\\\",\\\"isComplete\\\":false}]}]\"},{\"program_id\":3,\"program_name\":\"ออนเซน รักษาและฟื้นฟูสุขภาพโรคข้อเข่าเสื่อม\",\"date\":\"2024-11-04\",\"schedules\":\"[{\\\"day\\\":1,\\\"title\\\":\\\"วันแรก: ตรวจสุขภาพและเริ่มการฟื้นฟู\\\",\\\"activities\\\":[{\\\"sequence\\\":1,\\\"start_time\\\":\\\"09:00:00\\\",\\\"end_time\\\":\\\"10:30:00\\\",\\\"activity\\\":\\\"Check-In และตรวจสุขภาพ\\\",\\\"description\\\":\\\"เจาะเลือด วัดความดัน เช็คค่าน้ำตาลในเลือด และตรวจอาการโรคข้อเข่าเสื่อม\\\",\\\"location_id\\\":8,\\\"location_name\\\":\\\"โรงพยาบาลแม่ออน\\\",\\\"location_type\\\":\\\"hospital\\\",\\\"services\\\":[\\\"ตรวจสุขภาพทั่วไป\\\",\\\"ตรวจอาการโรคข้อเข่าเสื่อม\\\",\\\"รับคำปรึกษา\\\"],\\\"cost\\\":50,\\\"included_in_total_price\\\":true,\\\"is_mandatory\\\":true,\\\"isComplete\\\":false},{\\\"sequence\\\":2,\\\"start_time\\\":\\\"10:30:00\\\",\\\"end_time\\\":\\\"11:30:00\\\",\\\"activity\\\":\\\"บำบัดปวดตามศาสตร์แพทย์ล้านนา\\\",\\\"description\\\":\\\"ย่ำขางและนวดแผนโบราณ\\\",\\\"location_id\\\":16,\\\"location_name\\\":\\\"ศูนย์เรียนรู้แม่กำปอง\\\",\\\"location_type\\\":\\\"learning_resources\\\",\\\"services\\\":[\\\"ย่ำขาง\\\",\\\"นวดแผนโบราณ\\\"],\\\"cost\\\":400,\\\"included_in_total_price\\\":true,\\\"isComplete\\\":false},{\\\"sequence\\\":3,\\\"start_time\\\":\\\"16:00:00\\\",\\\"end_time\\\":\\\"16:30:00\\\",\\\"activity\\\":\\\"ออนเซนแช่เข่า\\\",\\\"description\\\":\\\"บำบัดด้วยน้ำแร่ธรรมชาติ\\\",\\\"location_id\\\":13,\\\"location_name\\\":\\\"น้ำพุร้อนสันกำแพง\\\",\\\"location_type\\\":\\\"attractions\\\",\\\"cost\\\":100,\\\"included_in_total_price\\\":false,\\\"note\\\":\\\"ชำระเงินที่สถานที่\\\",\\\"isComplete\\\":false}]},{\\\"day\\\":2,\\\"title\\\":\\\"วันที่สอง: เรียนรู้เกษตรอินทรีย์\\\",\\\"activities\\\":[{\\\"sequence\\\":1,\\\"start_time\\\":\\\"09:30:00\\\",\\\"end_time\\\":\\\"10:30:00\\\",\\\"activity\\\":\\\"เรียนรู้เกษตรอินทรีย์\\\",\\\"description\\\":\\\"เรียนรู้การปลูกผักออร์แกนิค และกิจกรรมครอบครัว\\\",\\\"location_id\\\":12,\\\"location_name\\\":\\\"แม่ทาออร์แกนิค\\\",\\\"location_type\\\":\\\"learning_resources\\\",\\\"cost\\\":200,\\\"included_in_total_price\\\":true,\\\"isComplete\\\":false},{\\\"sequence\\\":2,\\\"start_time\\\":\\\"16:00:00\\\",\\\"end_time\\\":\\\"16:30:00\\\",\\\"activity\\\":\\\"ออนเซนแช่เข่า\\\",\\\"description\\\":\\\"บำบัดด้วยน้ำแร่ธรรมชาติ\\\",\\\"location_id\\\":13,\\\"location_name\\\":\\\"น้ำพุร้อนสันกำแพง\\\",\\\"location_type\\\":\\\"attractions\\\",\\\"cost\\\":100,\\\"included_in_total_price\\\":false,\\\"isComplete\\\":false}]}]\"}]','2024-11-02','2024-11-03','2024-11-04',1,1.00,'PENDING','2024-11-01 10:06:24','2024-11-01 17:07:07'),
(37,1,'[{\"program_id\":1,\"program_name\":\"ผ่อนคลาย \\\"วิถีชีวิตแม่กำปอง\\\" และออนแซน\",\"date\":\"2024-11-04\",\"schedules\":\"[{\\\"day\\\":1,\\\"title\\\":\\\"ผ่อนคลายวิถีชีวิตแม่กำปอง\\\",\\\"activities\\\":[{\\\"sequence\\\":1,\\\"start_time\\\":\\\"09:00:00\\\",\\\"end_time\\\":\\\"10:00:00\\\",\\\"activity\\\":\\\"Check-In และตรวจสุขภาพ\\\",\\\"description\\\":\\\"เจาะเลือด วัดความดัน เช็คค่าน้ำตาลในเลือด\\\",\\\"location_id\\\":8,\\\"location_name\\\":\\\"โรงพยาบาลแม่ออน\\\",\\\"location_type\\\":\\\"hospital\\\",\\\"cost\\\":50,\\\"included_in_total_price\\\":true,\\\"is_mandatory\\\":true,\\\"isComplete\\\":false},{\\\"sequence\\\":2,\\\"start_time\\\":\\\"10:00:00\\\",\\\"end_time\\\":\\\"12:00:00\\\",\\\"activity\\\":\\\"กิจกรรมศูนย์เรียนรู้\\\",\\\"description\\\":\\\"ชมธรรมชาติ วิถีชีวิตชุมชนแม่กำปอง และรับบริการย่างแคร่/นวดแผนโบราณ\\\",\\\"location_id\\\":16,\\\"location_name\\\":\\\"ศูนย์เรียนรู้แม่กำปอง\\\",\\\"location_type\\\":\\\"learning_resources\\\",\\\"services\\\":[\\\"ย่างแคร่\\\",\\\"นวดแผนโบราณ\\\"],\\\"cost\\\":200,\\\"included_in_total_price\\\":true,\\\"isComplete\\\":false},{\\\"sequence\\\":3,\\\"start_time\\\":\\\"12:00:00\\\",\\\"end_time\\\":\\\"13:30:00\\\",\\\"activity\\\":\\\"เรียนทำอาหารพื้นเมือง\\\",\\\"description\\\":\\\"เรียนรู้การทำยำใบเมี่ยง ไข่ป่าม\\\",\\\"location_id\\\":2,\\\"location_name\\\":\\\"ยำใบเมี่ยง\\\",\\\"location_type\\\":\\\"learning_resources\\\",\\\"cost\\\":200,\\\"included_in_total_price\\\":true,\\\"isComplete\\\":false},{\\\"sequence\\\":4,\\\"start_time\\\":\\\"13:30:00\\\",\\\"end_time\\\":\\\"14:30:00\\\",\\\"activity\\\":\\\"ท่องเที่ยวแม่กำปอง\\\",\\\"description\\\":\\\"เที่ยวน้ำตก วัดคันธาพฤกษา และถนนคนเดิน\\\",\\\"location_id\\\":15,\\\"location_name\\\":\\\"ชุมชนแม่กำปอง\\\",\\\"location_type\\\":\\\"attractions\\\",\\\"locations\\\":[{\\\"id\\\":3,\\\"name\\\":\\\"น้ำตกแม่กำปอง\\\",\\\"type\\\":\\\"attractions\\\"},{\\\"id\\\":4,\\\"name\\\":\\\"วัดคันธาพฤกษา\\\",\\\"type\\\":\\\"attractions\\\"},{\\\"id\\\":5,\\\"name\\\":\\\"ถนนคนเดินแม่กำปอง\\\",\\\"type\\\":\\\"attractions\\\"}],\\\"cost\\\":0,\\\"included_in_total_price\\\":false,\\\"note\\\":\\\"ไม่มีค่าใช้จ่าย\\\",\\\"isComplete\\\":false},{\\\"sequence\\\":5,\\\"start_time\\\":\\\"14:30:00\\\",\\\"end_time\\\":\\\"15:30:00\\\",\\\"activity\\\":\\\"เดินทางไปน้ำพุร้อน\\\",\\\"description\\\":\\\"เดินทางไปน้ำพุร้อนสันกำแพง\\\",\\\"cost\\\":0,\\\"included_in_total_price\\\":false,\\\"isComplete\\\":false},{\\\"sequence\\\":6,\\\"start_time\\\":\\\"15:30:00\\\",\\\"end_time\\\":\\\"17:00:00\\\",\\\"activity\\\":\\\"แช่น้ำพุร้อน\\\",\\\"description\\\":\\\"ชมและแช่น้ำพุร้อนสันกำแพง\\\",\\\"location_id\\\":13,\\\"location_name\\\":\\\"น้ำพุร้อนสันกำแพง\\\",\\\"location_type\\\":\\\"attractions\\\",\\\"cost\\\":100,\\\"included_in_total_price\\\":false,\\\"note\\\":\\\"ชำระเงินที่สถานที่\\\",\\\"isComplete\\\":false}]}]\"}]','2024-11-02','2024-11-04','2024-11-04',1,1.00,'PENDING','2024-11-01 10:14:05','2024-11-01 17:14:20');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hospital`
--

DROP TABLE IF EXISTS `hospital`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hospital` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `location_id` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `address` text DEFAULT NULL,
  `subdistrict_id` int(11) NOT NULL,
  `contact` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `activites` text DEFAULT NULL,
  `health` text DEFAULT NULL,
  `date_info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `coast` decimal(8,2) DEFAULT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `location_id` (`location_id`),
  KEY `subdistrict_id` (`subdistrict_id`),
  CONSTRAINT `hospital_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `hospital_ibfk_2` FOREIGN KEY (`subdistrict_id`) REFERENCES `subdistricts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hospital`
--

LOCK TABLES `hospital` WRITE;
/*!40000 ALTER TABLE `hospital` DISABLE KEYS */;
INSERT INTO `hospital` VALUES
(1,8,'','75 หมู่ 1 ต. บ้านสหกรณ์ อ. แม่ออน\r\nจ. เชียงใหม่ 50130',4,'{\"tel\":[\"053880745\",\"053880991\",\"0848034449 (ติดต่อบริหาร/การเงิน/บัญชี)\",0622823366 (ศูนย์ฉีดวัคซีนโควิด-19)]}','เจาะเลือด วัดความดัน เช็คค่าน้ำตาลในเลือด',NULL,'{\"text\":\"ทุกวัน 24 ชั่วโมง\"}',50.00,'[\"https://www.maeonhospital.go.th/wp-content/uploads/2020/04/Untitled-1.jpg\",\"https://www.maeonhospital.go.th/wp-content/uploads/2019/04/Untitled-2-1600x734.jpg\"]','2024-10-29 14:13:53','2024-10-29 14:14:08');
/*!40000 ALTER TABLE `hospital` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `learning_resources`
--

DROP TABLE IF EXISTS `learning_resources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `learning_resources` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `location_id` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `address` text NOT NULL,
  `subdistrict_id` int(11) NOT NULL,
  `contact` longtext NOT NULL,
  `interest` text DEFAULT NULL,
  `product` text DEFAULT NULL,
  `activites` text DEFAULT NULL,
  `health` text DEFAULT NULL,
  `time_per_cycle` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`time_per_cycle`)),
  `people_per_cycle` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `cost` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `pre_booking` text DEFAULT NULL,
  `date_info` longtext DEFAULT NULL,
  `images` longtext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `location_id` (`location_id`),
  KEY `subdistrict_id` (`subdistrict_id`),
  CONSTRAINT `learning_resources_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `learning_resources_ibfk_2` FOREIGN KEY (`subdistrict_id`) REFERENCES `subdistricts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `learning_resources`
--

LOCK TABLES `learning_resources` WRITE;
/*!40000 ALTER TABLE `learning_resources` DISABLE KEYS */;
INSERT INTO `learning_resources` VALUES
(10,11,'เป็นป่าที่มีความอุดมสมบูรณ์ต้นไม้ พืชพันธุ์ พืชสมุนไพร สัตว์ป่า พื้นที่กว่า 20,000 ไร่ป่าต้นน้ำแม่ตะไคร้ น้ำแม่ทา น้ำแม่วอง(ว้อง) มีต้นไม้ใหญ่เช่น ไม้ยาง ไม้ตะเคียน','ต.ทาเหนือ อ.กิ่งอำเภอแม่ออน จ.เชียงใหม่',3,'{\"name\": \"สิทธิศักดิ์ นกแล\", \"line_tel\": \"095-2621395\", \"tel\": \"095-2621395\", \"meeting_point\": {\"name\": \"วัดแม่ตะไคร้\", \"latitude\": \"18.734827\", \"longitude\": \"99.303487\"}}','ป่าชุมชนที่มีความอุดมสมบูรณ์ เป็นแหล่งต้นน้ำสำคัญ และมีความหลากหลายทางชีวภาพ','[\"เห็ด\", \"ไข่มดแดง\"]','[{\"name\": \"กิจกรรมการดูแลอนุรักษ์ป่าของชุมชน\", \"details\": [\"กิจกรรมการปลูกป่า\", \"การทำแนวกันไฟ\", \"ชมต้นไม้ใหญ่ (ไม้ยาง ไม้ตะเคียน)\", \"เรียนรู้วิถีชีวิตปกากะญอ\", \"กิจกรรมเก็บเห็ด\", \"เรียนรู้เห็ดพิษ\", \"ชมสัตว์ป่า\"]}, {\"name\": \"กิจกรรมผจญภัยในป่าฤดูฝน\", \"details\": [\"การใช้ชีวิตในป่า\", \"เรียนรู้/กิน/นอน/เดินป่า\"]}, {\"name\": \"กิจกรรมการทำอาหารในป่า\", \"details\": [\"เก็บหน่อไม้\", \"เก็บเห็ด\", \"จับปลา\", \"ทำอาหาร: หลามปลา แกงหน่อ หมกเห็ด ไข่ป่าม\"]}]','ออกกำลังกาย เพลิดเพลินกับการชมพันธุ์ไม้ สมุนไพร และสัตว์ป่า','[{\"program_id\": 1, \"name\": \"โปรแกรมระยะสั้น\", \"time\": \"6h\", \"description\": \"ไปเช้ากลับเย็น\", \"price_per_person\": 500, \"min_people\": 5, \"max_people\": 10, \"price_conditions\": {\"default_price\": 500, \"min_group_size\": 5, \"small_group_price\": 800, \"note\": \"กรณีน้อยกว่า 5 คน คิดราคา 800 บาท/คน\"}}, {\"program_id\": 2, \"name\": \"โปรแกรมค้างคืน\", \"time\": \"2d1n\", \"description\": \"นอนในป่า\", \"price_per_person\": 1500, \"min_people\": 5, \"max_people\": 10, \"price_conditions\": {\"default_price\": 1500, \"min_group_size\": 5, \"small_group_price\": 2000, \"note\": \"กรณีน้อยกว่า 5 คน คิดราคา 2000 บาท/คน\"}}]','5-10 คน (ต่ำกว่า 5 คน จะเพิ่มราคา)','โปรแกรม ระยะสั้นเดินป่า : 500 บาท/คน\nโปรแกรม ระยะยาวเดินป่า นอนป่าด้วย : 1,500 บาท/คน','3 วัน','{\"text\": \"ทุกวัน\", \"pre_booking_days\": 3, \"note\": \"กรุณาจองล่วงหน้า 3 วัน\"}',NULL,'2024-10-29 14:44:00',NULL);
/*!40000 ALTER TABLE `learning_resources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location_types`
--

DROP TABLE IF EXISTS `location_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `location_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location_types`
--

LOCK TABLES `location_types` WRITE;
/*!40000 ALTER TABLE `location_types` DISABLE KEYS */;
INSERT INTO `location_types` VALUES
(1,'สถานที่ท่องเที่ยว','2024-10-19 19:16:04'),
(2,'ที่พัก','2024-10-19 19:16:04'),
(3,'แหล่งเรียนรู้','2024-10-19 19:16:04'),
(4,'ร้านอาหารและของฝาก','2024-10-19 19:16:04'),
(5,'โรงพยาบาล','2024-10-29 14:12:56');
/*!40000 ALTER TABLE `location_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` int(11) NOT NULL,
  `map` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `note` text DEFAULT NULL,
  `time_slots` longtext DEFAULT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `owner_id` (`owner_id`),
  KEY `type` (`type`),
  CONSTRAINT `locations_ibfk_1` FOREIGN KEY (`type`) REFERENCES `location_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `locations_ibfk_2` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES
(2,'ยำใบเมี่ยง',3,NULL,NULL,'[\"09:00-10:00\",\"10:00-11:00\",\"11:00-12:00\",\"12:00-13:00\",\"13:00-14:00\",\"14:00-15:00\",\"15:00-16:00\",\"16:00-17:00\"]',1,1,'2024-10-20 06:21:46','2024-10-30 05:05:57'),
(3,'น้ำตกแม่กำปอง',1,NULL,NULL,NULL,NULL,1,'2024-10-20 06:27:05','2024-10-30 05:05:59'),
(4,'วัดคันธาพฤกษา (วัดแม่กำปอง)',1,NULL,NULL,NULL,NULL,1,'2024-10-20 06:27:54','2024-10-30 05:06:01'),
(5,'ถนนคนเดินแม่กำปอง',1,NULL,NULL,NULL,NULL,1,'2024-10-20 06:29:36','2024-10-30 05:06:04'),
(7,'ศูนย์เรียนรู้ชุมชนบ้านป่างิ้ว',3,NULL,NULL,NULL,2,0,'2024-10-28 19:24:47','2024-10-30 05:06:11'),
(8,'โรงพยาบาลแม่ออน',5,NULL,NULL,NULL,NULL,1,'2024-10-29 14:13:38','2024-10-30 05:06:13'),
(9,'ฮิมดอยโฮมแม่กำปอง',2,NULL,NULL,NULL,NULL,0,'2024-10-29 14:16:05','2024-10-30 05:06:16'),
(10,'ผ่อม่อนแม่ออน โฮมสเตย์แอนด์แคมป์ไซต์',4,NULL,NULL,NULL,NULL,0,'2024-10-29 14:23:16','2024-10-30 05:06:09'),
(11,'ป่าชุมชนเชิงอนุรักษ์และผจญภัยบ้านแม่ตะไคร้',3,'{\"latitude\":\"18.734851928466686\",\"longitude\":\"99.3034750636564\"} ',NULL,NULL,NULL,0,'2024-10-29 14:31:56','2024-10-29 14:32:28'),
(12,'แม่ทาออร์แกนิค',4,'{\"latitude\":\"18.5873846181138\",\"longitude\":\"99.2641411645577\"}',NULL,NULL,NULL,0,'2024-10-30 05:09:41',NULL),
(13,'น้ำพุร้อนสันกำแพง',1,'{\"latitude\": \"18.734851928466686\", \"longitude\": \"99.3034750636564\"}',NULL,NULL,NULL,1,'2024-10-30 17:33:38',NULL),
(14,'ม่อนกุเวร',1,'{\"latitude\": \"18.86552412729214\", \"longitude\": \"99.3509964648321\"}',NULL,NULL,NULL,1,'2024-10-30 17:33:38',NULL),
(15,'ชุมชนแม่กำปอง',1,'{\"latitude\": \"18.86552412729214\", \"longitude\": \"99.3509964648321\"}',NULL,NULL,NULL,1,'2024-10-30 17:33:38',NULL),
(16,'ศูนย์เรียนรู้แม่กำปอง',3,NULL,NULL,NULL,NULL,1,'2024-10-30 22:33:02',NULL);
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` enum('SYSTEM','CHAT','ORDER','PAYMENT','PROMOTION','ANNOUNCEMENT','STATUS_UPDATE','REMINDER') NOT NULL,
  `title` varchar(255) NOT NULL,
  `body` text NOT NULL,
  `data` longtext DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `status` enum('UNREAD','READ','ARCHIVED') NOT NULL DEFAULT 'UNREAD',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES
(2,'SYSTEM','ยินดีต้อนรับสู่ Mae On Wellness','ขอบคุณที่เข้าร่วมเป็นส่วนหนึ่งของเรา',NULL,1,'READ','2024-10-26 08:14:35','2024-10-27 11:39:53',0),
(3,'SYSTEM','อัพเดทแอพเวอร์ชันใหม่','แอพได้รับการอัพเดทเป็นเวอร์ชัน 1.0.1 แล้ว','{\"link\":\"/settings/app-version\"}',1,'READ','2024-10-26 08:14:35','2024-10-27 11:39:37',0),
(6,'STATUS_UPDATE','ยืนยันการจองสำเร็จ','การจองของคุณได้รับการยืนยันแล้ว','{\"orderId\": 1, \"link\": \"/activity\"}',1,'READ','2024-10-26 08:14:35','2024-11-01 10:18:07',0),
(7,'STATUS_UPDATE','การเดินทางของคุณกำลังจะเริ่มขึ้น','การเดินทางของคุณจะเริ่มในอีก 1 วัน','{\"orderId\": 1, \"link\": \"/map\"}',1,'UNREAD','2024-10-24 08:14:35',NULL,0),
(8,'ANNOUNCEMENT','โปรโมชันพิเศษประจำเดือน','รับส่วนลด 20% สำหรับการจองในเดือนนี้','{\"link\": \"/promotions\"}',1,'READ','2024-10-26 08:14:35','2024-11-01 10:18:10',0),
(9,'ANNOUNCEMENT','วันหยุดพิเศษ','แจ้งวันหยุดให้บริการในวันที่ 13-15 เมษายน',NULL,1,'UNREAD','2024-10-21 08:14:35','2024-11-01 11:03:23',0),
(10,'CHAT','ข้อความใหม่','คุณมีข้อความใหม่จากทีมงาน','{\"chatId\": 1, \"link\": \"/chats/1\"}',1,'UNREAD','2024-10-26 08:14:35',NULL,0),
(11,'ORDER','การจองสำเร็จ','คุณได้ทำการจองเรียบร้อยแล้ว รอการยืนยัน','{\"orderId\": 1, \"link\": \"/activity\"}',1,'READ','2024-10-26 08:14:35','2024-10-26 07:33:45',0),
(12,'PROMOTION','โปรโมชันพิเศษ','รับส่วนลดพิเศษ 30% เมื่อจองภายในวันนี้','{\"link\": \"/promotions/special\"}',1,'UNREAD','2024-10-26 08:14:35',NULL,0);
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) NOT NULL,
  `payment_method` enum('PROMPTPAY','BANK_ACCOUNT_NUMBER') DEFAULT NULL,
  `payment_data` longtext DEFAULT NULL,
  `slip_image` varchar(255) DEFAULT NULL,
  `status` enum('PENDING','PAID','FAILED','REFUNDED','PENDING_VERIFICATION','REJECTED') NOT NULL DEFAULT 'PENDING',
  `transaction_id` varchar(255) DEFAULT NULL,
  `payment_date` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `booking_id_2` (`booking_id`),
  KEY `booking_id` (`booking_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=112 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES
(110,36,'PROMPTPAY','{\"qr_code_data\":\"00020101021229370016A000000677010111011300669028561885802TH530376454041.0063044EA1\",\"promptpay_id\":\"0902856188\"}','1-1730480838883.jpg','PAID','0045000600000101030300224430517745322I000018B97905102TH9104859D','2024-11-02 00:07:24','2024-11-01 10:06:24','2024-11-01 17:07:24'),
(111,37,'PROMPTPAY','{\"qr_code_data\":\"00020101021229370016A000000677010111011300669028561885802TH53037645406450.0063040905\",\"promptpay_id\":\"0902856188\"}','1-1730481265326.jpg','PAID','0045000600000101030300224430517745322I000018B97905102TH9104859D','2024-11-02 00:14:28','2024-11-01 10:14:05','2024-11-01 17:14:28');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `program_types`
--

DROP TABLE IF EXISTS `program_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `program_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `program_types`
--

LOCK TABLES `program_types` WRITE;
/*!40000 ALTER TABLE `program_types` DISABLE KEYS */;
INSERT INTO `program_types` VALUES
(1,'โปรแกรมระยะสั้น (One-day trip)','8 มิติ Wellness ใน 8 โปรแกรมท่องเที่ยว เป็นโปรแกรมการท่องเที่ยวระยะสั้นที่จะได้ทั้งผ่อนคลายได้ท่องเที่ยวเรียนรู้ไปกับสถานที่ต่างๆภายใน 1 วันเต็ม','2024-09-25 10:55:26'),
(2,'โปรแกรมฟื้นฟูสุขภาพ (Long-day trip)','โปรแกรมท่องเที่ยวระยะยาวที่จะให้นักท่องเที่ยวได้ไปท่องเที่ยวหลายวันตามโปรแกรมที่กำหนด และยังได้การฟื้นฟูสุขภาพที่ดีขึ้นอีกด้วย','2024-09-25 10:55:26'),
(3,'โปรแกรมการท่องเที่ยวด้วยตัวเอง','กิจกรรมการท่องเที่ยวรูปแบบต่างๆ แยกตามตำบลของอำเภอแม่ออน ที่นักท่องเที่ยวสามารถจัดสรรค์เวลา เลือกจองการท่องเที่ยวเพื่อสุขภาพที่ไหนเองก็ได้ตามใจชอบ','2024-09-25 10:55:26');
/*!40000 ALTER TABLE `program_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `programs`
--

DROP TABLE IF EXISTS `programs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `programs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` int(11) NOT NULL,
  `program_category` enum('SHORT','LONG') NOT NULL DEFAULT 'SHORT',
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `schedules` longtext NOT NULL,
  `total_price` decimal(8,2) NOT NULL,
  `wellness_dimensions` text DEFAULT NULL,
  `images` longtext DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `duration_days` int(11) DEFAULT NULL,
  `status` enum('DRAFT','CONFIRMED','CANCELLED') DEFAULT 'DRAFT',
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `type` (`type`),
  CONSTRAINT `programs_ibfk_1` FOREIGN KEY (`type`) REFERENCES `program_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `programs_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `programs`
--

LOCK TABLES `programs` WRITE;
/*!40000 ALTER TABLE `programs` DISABLE KEYS */;
INSERT INTO `programs` VALUES
(1,1,'SHORT','ผ่อนคลาย \"วิถีชีวิตแม่กำปอง\" และออนแซน','หลังจากที่เหนื่อยล้าจากการทำงาน มาชาร์ตแบต มาฮิลใจ มาสัมผัสอากาศ ฟื้นฟูสุขภาพกายใจ มาดูวิถีชีวิตของชาวบ้านแม่กำปอง เป็นหมู่บ้านเล็กๆ ซ่อนตัวอยู่ท่ามกลางป่าเขาเขียวขจี มีความบริสุทธิ์ของธรรมชาติที่อุดมสมบูรณ์','[{\"day\": 1, \"title\": \"ผ่อนคลายวิถีชีวิตแม่กำปอง\", \"activities\": [{\"sequence\": 1, \"start_time\": \"09:00:00\", \"end_time\": \"10:00:00\", \"activity\": \"Check-In และตรวจสุขภาพ\", \"description\": \"เจาะเลือด วัดความดัน เช็คค่าน้ำตาลในเลือด\", \"location_id\": 8, \"location_name\": \"โรงพยาบาลแม่ออน\", \"location_type\": \"hospital\", \"cost\": 50.00, \"included_in_total_price\": true, \"is_mandatory\": true}, {\"sequence\": 2, \"start_time\": \"10:00:00\", \"end_time\": \"12:00:00\", \"activity\": \"กิจกรรมศูนย์เรียนรู้\", \"description\": \"ชมธรรมชาติ วิถีชีวิตชุมชนแม่กำปอง และรับบริการย่างแคร่/นวดแผนโบราณ\", \"location_id\": 16, \"location_name\": \"ศูนย์เรียนรู้แม่กำปอง\", \"location_type\": \"learning_resources\", \"services\": [\"ย่างแคร่\", \"นวดแผนโบราณ\"], \"cost\": 200.00, \"included_in_total_price\": true}, {\"sequence\": 3, \"start_time\": \"12:00:00\", \"end_time\": \"13:30:00\", \"activity\": \"เรียนทำอาหารพื้นเมือง\", \"description\": \"เรียนรู้การทำยำใบเมี่ยง ไข่ป่าม\", \"location_id\": 2, \"location_name\": \"ยำใบเมี่ยง\", \"location_type\": \"learning_resources\", \"cost\": 200.00, \"included_in_total_price\": true}, {\"sequence\": 4, \"start_time\": \"13:30:00\", \"end_time\": \"14:30:00\", \"activity\": \"ท่องเที่ยวแม่กำปอง\", \"description\": \"เที่ยวน้ำตก วัดคันธาพฤกษา และถนนคนเดิน\", \"location_id\": 15, \"location_name\": \"ชุมชนแม่กำปอง\", \"location_type\": \"attractions\", \"locations\": [{\"id\": 3, \"name\": \"น้ำตกแม่กำปอง\", \"type\": \"attractions\"}, {\"id\": 4, \"name\": \"วัดคันธาพฤกษา\", \"type\": \"attractions\"}, {\"id\": 5, \"name\": \"ถนนคนเดินแม่กำปอง\", \"type\": \"attractions\"}], \"cost\": 0.00, \"included_in_total_price\": false, \"note\": \"ไม่มีค่าใช้จ่าย\"}, {\"sequence\": 5, \"start_time\": \"14:30:00\", \"end_time\": \"15:30:00\", \"activity\": \"เดินทางไปน้ำพุร้อน\", \"description\": \"เดินทางไปน้ำพุร้อนสันกำแพง\", \"cost\": 0.00, \"included_in_total_price\": false}, {\"sequence\": 6, \"start_time\": \"15:30:00\", \"end_time\": \"17:00:00\", \"activity\": \"แช่น้ำพุร้อน\", \"description\": \"ชมและแช่น้ำพุร้อนสันกำแพง\", \"location_id\": 13, \"location_name\": \"น้ำพุร้อนสันกำแพง\", \"location_type\": \"attractions\", \"cost\": 100.00, \"included_in_total_price\": false, \"note\": \"ชำระเงินที่สถานที่\"}]}]',450.00,'เดินออกกำลังกาย สัมผัสธรรมชาติบรรยากาศดีๆ เรียนรู้วิถีชุมชน ผ่อนคลาย ฟื้นฟูสภาพกายใจ สร้างมิติ Wellnessในมิติร่างกาย (Physical) มิติอารมณ์หรือจิตใจ (Emotional/Psychological) มิติสังคม (Social) มิติสติปัญญาหรือองค์ความรู้ทางสุขภาพ (Intellectual/Cognitive) มิติอาชีวอนามัย (Occupational) มิติการเงิน (Financial) และ มิติสิ่งแวดล้อม(Environmental)','[\"Mae-Kampong-Chiang-Mai-02.jpg\",\"maxresdefault (1).jpg\"]',NULL,'2024-10-30 23:15:05','2024-10-30 23:54:22',1,'CONFIRMED'),
(2,3,'SHORT','ทริปสุขภาพแม่ออน 1 วัน','โปรแกรมท่องเที่ยวเชิงสุขภาพที่ผู้ใช้ออกแบบเอง','[{\"day\": 1, \"date\": \"2024-11-15\", \"title\": \"ท่องเที่ยวเชิงสุขภาพ\", \"activities\": [{\"sequence\": 1, \"start_time\": \"09:00:00\", \"end_time\": \"10:00:00\", \"activity\": \"ตรวจสุขภาพ\", \"description\": \"เจาะเลือด วัดความดัน เช็คค่าน้ำตาลในเลือด\", \"location_id\": 8, \"location_name\": \"โรงพยาบาลแม่ออน\", \"location_type\": \"hospital\", \"cost\": 50.00, \"included_in_total_price\": true, \"is_mandatory\": true}, {\"sequence\": 2, \"start_time\": \"10:30:00\", \"end_time\": \"12:00:00\", \"activity\": \"ป่าผจญภัยแม่ตะไคร้\", \"description\": \"กิจกรรมเดินป่า เรียนรู้ธรรมชาติ\", \"location_id\": 11, \"location_name\": \"ป่าชุมชนเชิงอนุรักษ์และผจญภัยบ้านแม่ตะไคร้\", \"location_type\": \"learning_resources\", \"selected_program\": {\"id\": 1, \"name\": \"โปรแกรมระยะสั้น\", \"time\": \"6h\", \"people_count\": 2, \"price_per_person\": 800, \"total_price\": 1600}, \"cost\": 1600.00, \"included_in_total_price\": true}]}]',1650.00,NULL,'[\"Mae-Kampong-Chiang-Mai-02.jpg\",\"maxresdefault.jpg\"]',1,'2024-10-30 23:15:05','2024-10-30 23:54:47',1,'DRAFT'),
(3,2,'LONG','ออนเซน รักษาและฟื้นฟูสุขภาพโรคข้อเข่าเสื่อม','โปรแกรมฟื้นฟูสุขภาพโรคข้อเข่าเสื่อมระยะเวลา 4 วัน ภายใต้การดูแลของโรงพยาบาลแม่ออน','[{\"day\":1,\"title\":\"วันแรก: ตรวจสุขภาพและเริ่มการฟื้นฟู\",\"activities\":[{\"sequence\":1,\"start_time\":\"09:00:00\",\"end_time\":\"10:30:00\",\"activity\":\"Check-In และตรวจสุขภาพ\",\"description\":\"เจาะเลือด วัดความดัน เช็คค่าน้ำตาลในเลือด และตรวจอาการโรคข้อเข่าเสื่อม\",\"location_id\":8,\"location_name\":\"โรงพยาบาลแม่ออน\",\"location_type\":\"hospital\",\"services\":[\"ตรวจสุขภาพทั่วไป\",\"ตรวจอาการโรคข้อเข่าเสื่อม\",\"รับคำปรึกษา\"],\"cost\":50,\"included_in_total_price\":true,\"is_mandatory\":true},{\"sequence\":2,\"start_time\":\"10:30:00\",\"end_time\":\"11:30:00\",\"activity\":\"บำบัดปวดตามศาสตร์แพทย์ล้านนา\",\"description\":\"ย่ำขางและนวดแผนโบราณ\",\"location_id\":16,\"location_name\":\"ศูนย์เรียนรู้แม่กำปอง\",\"location_type\":\"learning_resources\",\"services\":[\"ย่ำขาง\",\"นวดแผนโบราณ\"],\"cost\":400,\"included_in_total_price\":true},{\"sequence\":3,\"start_time\":\"16:00:00\",\"end_time\":\"16:30:00\",\"activity\":\"ออนเซนแช่เข่า\",\"description\":\"บำบัดด้วยน้ำแร่ธรรมชาติ\",\"location_id\":13,\"location_name\":\"น้ำพุร้อนสันกำแพง\",\"location_type\":\"attractions\",\"cost\":100,\"included_in_total_price\":false,\"note\":\"ชำระเงินที่สถานที่\"}]},{\"day\":2,\"title\":\"วันที่สอง: เรียนรู้เกษตรอินทรีย์\",\"activities\":[{\"sequence\":1,\"start_time\":\"09:30:00\",\"end_time\":\"10:30:00\",\"activity\":\"เรียนรู้เกษตรอินทรีย์\",\"description\":\"เรียนรู้การปลูกผักออร์แกนิค และกิจกรรมครอบครัว\",\"location_id\":12,\"location_name\":\"แม่ทาออร์แกนิค\",\"location_type\":\"learning_resources\",\"cost\":200,\"included_in_total_price\":true},{\"sequence\":2,\"start_time\":\"16:00:00\",\"end_time\":\"16:30:00\",\"activity\":\"ออนเซนแช่เข่า\",\"description\":\"บำบัดด้วยน้ำแร่ธรรมชาติ\",\"location_id\":13,\"location_name\":\"น้ำพุร้อนสันกำแพง\",\"location_type\":\"attractions\",\"cost\":100,\"included_in_total_price\":false}]}]',5000.00,'สร้างมิติ Wellness ในมิติร่างกาย (Physical) มิติอารมณ์หรือจิตใจ (Emotional/Psychological) มิติสังคม (Social)มิ ติ สติ ปัญญาหรื อองค์ ความรู้ ทางสุ ขภาพ (Intellectual/Cognitive) มิ ติ จิ ตวิ ญญาณ (Spiritual) มิ ติ อาชี วอนามัย(Occupational) มิติการเงิน (Financial) และ มิติสิ่งแวดล้อม (Environmental)','[\"1659434714_876589-chiangmainews.jpg\",\"maxresdefault.jpg\"]',NULL,'2024-10-30 23:14:46','2024-10-30 23:54:53',4,'CONFIRMED'),
(4,3,'LONG','ทริปฟื้นฟูสุขภาพ 3 วัน','โปรแกรมท่องเที่ยวเชิงสุขภาพแบบกำหนดเอง','[{\"day\": 1, \"date\": \"2024-11-15\", \"title\": \"วันแรก: ตรวจสุขภาพและท่องเที่ยวแม่กำปอง\", \"activities\": [{\"sequence\": 1, \"start_time\": \"09:00:00\", \"end_time\": \"10:00:00\", \"activity\": \"ตรวจสุขภาพ\", \"location_id\": 8, \"location_type\": \"hospital\", \"cost\": 50.00, \"included_in_total_price\": true, \"is_mandatory\": true}]}, {\"day\": 2, \"date\": \"2024-11-16\", \"title\": \"วันที่สอง: สัมผัสวิถีชีวิตเกษตรอินทรีย์\", \"activities\": [{\"sequence\": 1, \"start_time\": \"09:00:00\", \"end_time\": \"12:00:00\", \"activity\": \"เรียนรู้เกษตรอินทรีย์\", \"location_id\": 12, \"location_type\": \"learning_resources\", \"cost\": 200.00, \"included_in_total_price\": true}]}]',2500.00,NULL,'[\"Mae-Kampong-Chiang-Mai-02.jpg\",\"maxresdefault (1).jpg\"]',1,'2024-10-30 23:14:46','2024-10-30 23:54:25',3,'DRAFT');
/*!40000 ALTER TABLE `programs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `restaurant`
--

DROP TABLE IF EXISTS `restaurant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `restaurant` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `location_id` int(11) NOT NULL,
  `description` text NOT NULL,
  `address` text NOT NULL,
  `subdistrict_id` int(11) NOT NULL,
  `contact` longtext NOT NULL,
  `Interesting_menu` text DEFAULT NULL,
  `served_per_hour` int(11) DEFAULT NULL,
  `health` text DEFAULT NULL,
  `date_info` longtext DEFAULT NULL,
  `service_fee` text DEFAULT NULL,
  `images` longtext DEFAULT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `location_id` (`location_id`),
  KEY `subdistrict_id` (`subdistrict_id`),
  CONSTRAINT `restaurant_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `restaurant_ibfk_2` FOREIGN KEY (`subdistrict_id`) REFERENCES `subdistricts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurant`
--

LOCK TABLES `restaurant` WRITE;
/*!40000 ALTER TABLE `restaurant` DISABLE KEYS */;
INSERT INTO `restaurant` VALUES
(1,12,'','ตำบล แม่ทา อำเภอ แม่ออน เชียงใหม่ 50130',2,'{\"tel\":[\"0966970079\"]}','1. เมนู กาแฟความน่าสนใจของเมนูเป็นเมล็ดกาแฟออร์แกนิค จากเกษตรกรเครือข่ายแม่วางผลต่อสุขภาพลดความเสี่ยงเป็นโรคนิ่ว ช่วยลดความเครียดลดโอกาสเป็นโรคเกาต์ ลดความเสี่ยงเป็นโรคพาคินสันปลุกความตื่นตัวได้ในทันที กระตุ้นการทำงานของระบบเผาผลาญลดความเสี่ยงเป็นโรคมะเร็ง ช่วยกระตุ้นความจำรอดจากโรคเบาหวานชนิดที่ 2ราคา 35-40 บาทช่วงเวลารับประทานทานได้ตลอดเวลา\\n2. เมนู นมสดความน่าสนใจของเมนูเป็นนมโคแท้ 100% จากฟาร์มโคนมในชุมชน นมสดใหม่วันต่อวันผลต่อสุขภาพมีไขมันดี เพิ่มพลังงานให้แก่ร่างกาย โปรตีน ได้แก่ เคซิน โกลบูริน อัลบูมินและเอนไซม์ ที่สูงซึ่งมีประโยชน์ต่อการสร้างเม็ดเลือดและกระดูก แคลเซียมสูงเสริมความแข็งแรงของกระดูกและฟัน ลดความดันโลหิต ลดความเสี่ยงมะเร็ง\r\nลำไส้ และนมช่วยให้เลือดแข็งตัวได้ดีหากเกิดอุบัติเหตุหรือมีบาดแผลราคา25-30 บาทช่วงเวลารับประทาน ทานได้ตลอดเวลา',NULL,NULL,'{\"text\":\"ทุกวัน\",\"start\":\"09:00\",\"end\":\"17:00\"}',NULL,NULL,'2024-10-30 05:26:54',NULL);
/*!40000 ALTER TABLE `restaurant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `slip_remaining`
--

DROP TABLE IF EXISTS `slip_remaining`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `slip_remaining` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `count` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `slip_remaining`
--

LOCK TABLES `slip_remaining` WRITE;
/*!40000 ALTER TABLE `slip_remaining` DISABLE KEYS */;
INSERT INTO `slip_remaining` VALUES
(1,14,'2024-10-30 05:27:04');
/*!40000 ALTER TABLE `slip_remaining` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subdistricts`
--

DROP TABLE IF EXISTS `subdistricts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subdistricts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subdistricts`
--

LOCK TABLES `subdistricts` WRITE;
/*!40000 ALTER TABLE `subdistricts` DISABLE KEYS */;
INSERT INTO `subdistricts` VALUES
(1,'ตำบลห้วยแก้ว','2024-10-29 10:51:39'),
(2,'ตำบลแม่ทา','2024-10-29 10:51:39'),
(3,'ตำบลทาเหนือ','2024-10-29 10:51:39'),
(4,'ตำบลบ้านสหกรณ์','2024-10-29 10:51:39'),
(5,'ตำบลออนกลาง','2024-10-29 10:51:39'),
(6,'ตำบลออนเหนือ','2024-10-29 10:51:39');
/*!40000 ALTER TABLE `subdistricts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(150) NOT NULL,
  `lastname` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(60) NOT NULL,
  `tel` varchar(20) NOT NULL,
  `profile_picture` varchar(150) DEFAULT 'default-profile.jpg',
  `role` enum('user','admin','hospital','restaurant','attractions','learning_resources','accommodation') DEFAULT 'user',
  `usage_status` enum('OFFLINE','ONLINE') DEFAULT 'OFFLINE',
  `status_last_update` timestamp NULL DEFAULT current_timestamp(),
  `account_status` enum('DELETE','ACTIVE','SUSPEND') DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(1,'เอกลักษณ์g','kruaboon','akalakkruaboon@gmail.com','$2b$04$7btnxfaDjjQj/GGuD7T8luImFQ/rIwuAmBgz/Ien9CSrkudJXH82G','0902856188','1-1730480701074.jpg','user','OFFLINE','2024-11-01 19:55:36','ACTIVE','2024-10-17 18:33:08',NULL),
(2,'ชายสี่','หมี่กล้วย','chay4@gmail.com','$2b$04$3639ScvEyod71aVKBmVGauwkMWXv5efhRULHL4oJmdDKL/Vhof/mO','0902856188','2-1729507867618.jpg','attractions','OFFLINE','2024-10-30 22:29:58','ACTIVE','2024-10-21 10:50:55',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;