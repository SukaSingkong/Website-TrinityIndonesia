import { Wrapper } from '@layer/components/layout/Wrapper.jsx'
import { Icons } from '@layer/components/elements/Icons.jsx'
import { useState } from "react"
import config from '@layer/theme.config'
import { Tab } from '@headlessui/react'

const modeInfo = {
	oneblock: { name: 'OneBlock', gradient: 'from-emerald-500 to-teal-500', cheatPolicy: 'DILARANG', toxicPolicy: 'DILARANG', description: 'Mode survival dengan aturan ketat untuk fair play' },
	boxsmp: { name: 'BoxSMP', gradient: 'from-blue-500 to-indigo-500', cheatPolicy: 'DILARANG', toxicPolicy: 'DILARANG', description: 'Mode SMP dengan komunitas ramah dan aturan' },
	anarchy: { name: 'Anarchy Economy', gradient: 'from-red-500 to-rose-500', cheatPolicy: 'DIIZINKAN*', toxicPolicy: 'DIIZINKAN*', description: 'Mode bebas dengan minimal aturan' }
}

const generalRules = [
	{
		title: 'Pasal 1: Persetujuan dan Ketentuan Bermain',
		content: [
			{ num: '1.1', text: 'Dengan masuk ke server Trinity Indonesia melalui IP server resmi, pemain secara otomatis dan tanpa syarat dianggap telah membaca, memahami sepenuhnya, menerima, dan menyetujui seluruh aturan yang tercantum dalam dokumen ini beserta segala pembaruan yang dilakukan di kemudian hari.' },
			{ num: '1.2', text: 'Ketidaktahuan atau klaim tidak mengetahui terhadap aturan yang berlaku BUKAN merupakan alasan yang sah dan tidak akan diterima sebagai pembelaan untuk menghindari, mengurangi, atau membatalkan sanksi yang dijatuhkan oleh staff.' },
			{ num: '1.3', text: 'Aturan yang tercantum dalam dokumen ini dapat diubah, ditambah, dikurangi, atau dimodifikasi sewaktu-waktu oleh pihak pengelola server tanpa pemberitahuan terlebih dahulu kepada pemain. Perubahan aturan berlaku efektif dan mengikat sejak saat diumumkan melalui platform resmi server (Discord, Website, atau pengumuman in-game).' },
			{ num: '1.4', text: 'Tim Staff server memiliki wewenang penuh dan kebijaksanaan untuk mengambil tindakan terhadap perilaku, tindakan, atau aktivitas yang dianggap merugikan, mengganggu, atau bertentangan dengan semangat fair play dan kenyamanan bermain, meskipun tindakan tersebut tidak secara eksplisit dan spesifik disebutkan dalam aturan tertulis ini.' },
			{ num: '1.5', text: 'Segala keputusan yang diambil oleh Staff bersifat final dan mengikat. Banding atau keberatan hanya dapat diajukan satu kali melalui sistem tiket resmi di Discord server dalam waktu maksimal 7 (tujuh) hari kalender sejak sanksi dijatuhkan. Keputusan banding bersifat final dan tidak dapat diganggu gugat.' },
			{ num: '1.6', text: 'Dengan bermain di server ini, pemain juga menyatakan bahwa mereka berusia minimal 13 tahun atau memiliki izin dari orang tua/wali untuk bermain. Server tidak bertanggung jawab atas pelanggaran ketentuan usia ini.' }
		]
	},
	{
		title: 'Pasal 2: Keamanan dan Tanggung Jawab Akun',
		content: [
			{ num: '2.1', text: 'Setiap pemain bertanggung jawab penuh dan mutlak atas keamanan akun Minecraft yang mereka gunakan untuk mengakses server. Segala aktivitas, tindakan, transaksi, atau pelanggaran yang dilakukan menggunakan akun tersebut sepenuhnya menjadi tanggung jawab pemilik akun yang terdaftar.' },
			{ num: '2.2', text: 'Dilarang keras dan tanpa pengecualian untuk membagikan, memberitahukan, atau mengekspos informasi login akun termasuk namun tidak terbatas pada: password, session token, access token, refresh token, atau data autentikasi lainnya kepada pihak manapun, termasuk namun tidak terbatas pada staff server, teman, keluarga, atau pihak ketiga lainnya.' },
			{ num: '2.3', text: 'Staff Trinity Indonesia TIDAK PERNAH dan TIDAK AKAN PERNAH meminta password atau informasi login akun pemain dalam situasi apapun. Segala permintaan password yang mengatasnamakan staff adalah penipuan dan wajib dilaporkan.' },
			{ num: '2.4', text: 'Apabila akun pemain diretas, dikompromikan, atau disalahgunakan oleh pihak lain dan digunakan untuk melakukan pelanggaran aturan, sanksi tetap berlaku dan dikenakan pada akun tersebut tanpa pengecualian. Pemilik akun dapat mengajukan banding disertai dengan bukti-bukti yang valid, lengkap, dan dapat diverifikasi.' },
			{ num: '2.5', text: 'Penggunaan akun alternatif (alt account) atau akun multipel dengan tujuan untuk menghindari, mengakali, atau meringankan sanksi yang sedang berjalan, atau untuk mendapatkan keuntungan tidak adil dalam gameplay, akan mengakibatkan sanksi ban permanen pada SELURUH akun yang terdeteksi terkait dengan pemain tersebut.' },
			{ num: '2.6', text: 'Aktivitas jual-beli, tukar-menukar, atau transfer kepemilikan akun Minecraft yang terhubung dengan server Trinity Indonesia adalah dilarang. Pemain yang terbukti terlibat dalam aktivitas tersebut akan dikenakan ban permanen tanpa peringatan.' },
			{ num: '2.7', text: 'Pemain wajib menggunakan nama akun Minecraft yang tidak mengandung unsur SARA, kata-kata kasar, nama tokoh kontroversial, atau konten tidak pantas lainnya. Akun dengan nama melanggar dapat dilarang masuk tanpa pemberitahuan.' },
			{ num: '2.8', text: 'DILARANG KERAS berpura-pura menjadi Admin, Staff, atau pihak resmi server. Pemain yang mengaku sebagai staff untuk menipu, mendapatkan kepercayaan, atau keuntungan apapun akan dikenakan sanksi BAN PERMANEN tanpa peringatan.' }
		]
	},
	{
		title: 'Pasal 3: Privasi dan Keamanan Data',
		content: [
			{ num: '3.1', text: 'Dilarang keras dan mutlak untuk membagikan, menyebarkan, mempublikasikan, atau mengekspos informasi pribadi (doxxing) milik pemain lain termasuk namun tidak terbatas pada: nama asli, alamat rumah/kantor/sekolah, nomor telepon, alamat email, foto/video pribadi, akun media sosial, informasi keuangan, atau data identitas sensitif lainnya.' },
			{ num: '3.2', text: 'Dilarang meminta, memaksa, memanipulasi, atau menggunakan teknik social engineering untuk mendapatkan informasi pribadi dari pemain lain dengan alasan, dalih, atau tujuan apapun termasuk yang terlihat tidak berbahaya.' },
			{ num: '3.3', text: 'Server menyimpan dan memproses data aktivitas pemain termasuk log chat, log transaksi, log koneksi, dan metadata lainnya untuk keperluan moderasi, keamanan, dan peningkatan layanan. Data ini dijaga kerahasiaannya dengan standar keamanan yang wajar dan tidak akan dibagikan kepada pihak ketiga kecuali diwajibkan oleh hukum yang berlaku di Indonesia.' },
			{ num: '3.4', text: 'Melaporkan aktivitas mencurigakan seperti percobaan phishing, penipuan, pencurian data, atau aktivitas berbahaya lainnya adalah kewajiban moral setiap pemain demi keamanan bersama. Laporan dapat dilakukan melalui sistem tiket Discord.' },
			{ num: '3.5', text: 'Dilarang menyebarkan link, file, atau konten yang mengandung malware, virus, trojan, spyware, atau program berbahaya lainnya melalui chat, sign, book, atau media apapun di dalam server.' }
		]
	},
	{
		title: 'Pasal 4: Kebijakan Pembelian Gems dan Transaksi',
		content: [
			{ num: '4.1', text: 'Semua pembelian Gems yang dilakukan melalui sistem resmi server Trinity Indonesia bersifat FINAL dan TIDAK DAPAT DIKEMBALIKAN (non-refundable) dalam keadaan, situasi, atau alasan apapun tanpa pengecualian.' },
			{ num: '4.2', text: 'TIDAK ADA REFUND untuk kesalahan yang disebabkan oleh pihak pembeli, termasuk namun tidak terbatas pada: kesalahan input nickname, kesalahan memilih platform (Java/Bedrock), kesalahan jumlah pembelian, atau mencentang opsi "Dukungan sebagai anonim" yang menyebabkan gems tidak terkirim.' },
			{ num: '4.3', text: 'Pembeli WAJIB memastikan nickname Minecraft dan platform (Java/Bedrock) yang diinput sudah benar sebelum melakukan pembayaran. Server tidak bertanggung jawab atas kesalahan input data oleh pembeli.' },
			{ num: '4.4', text: 'Melakukan chargeback, dispute pembayaran, atau klaim pengembalian dana kepada penyedia layanan pembayaran untuk transaksi yang sudah berhasil diproses adalah pelanggaran serius. Pemain yang terbukti melakukan chargeback akan dikenakan sanksi ban permanen serta dapat dituntut secara hukum sesuai dengan peraturan perundang-undangan yang berlaku di Indonesia.' },
			{ num: '4.5', text: 'Gems yang sudah dibeli dan dikirim ke akun pemain tidak dapat dipindahtangankan, dijual kembali, atau ditukar dengan uang nyata. Transaksi jual-beli Gems antar pemain di luar sistem resmi sepenuhnya menjadi risiko dan tanggung jawab pemain yang terlibat.' },
			{ num: '4.6', text: 'Refund HANYA dapat dipertimbangkan jika terjadi kesalahan teknis dari pihak server yang menyebabkan Gems tidak terkirim meskipun pembayaran sudah berhasil DAN pembeli dapat menunjukkan bukti pembayaran yang valid. Pengajuan refund wajib dilakukan melalui sistem tiket Discord dalam waktu maksimal 7 hari sejak transaksi.' },
			{ num: '4.7', text: 'Harga dan ketersediaan paket Gems dapat berubah sewaktu-waktu tanpa pemberitahuan. Benefit yang sudah diterima pada saat transaksi berlaku sesuai kondisi saat itu dan tidak terpengaruh oleh perubahan di kemudian hari.' }
		]
	},
	{
		title: 'Pasal 5: Hak Kekayaan Intelektual dan Konten',
		content: [
			{ num: '5.1', text: 'Seluruh aset server termasuk namun tidak terbatas pada: logo, nama brand, desain grafis, plugin custom, konfigurasi server, world/map, bangunan spawn, sistem ekonomi, dan konten original lainnya adalah hak milik eksklusif Trinity Indonesia dan/atau pihak yang memberikan lisensi kepada server.' },
			{ num: '5.2', text: 'Pemain diperbolehkan dan didorong untuk membuat konten kreatif berupa video, livestream, screenshot, atau karya turunan lainnya yang menampilkan gameplay di server Trinity Indonesia dengan syarat mencantumkan kredit yang jelas dan tidak memfitnah atau mencemarkan nama baik server.' },
			{ num: '5.3', text: 'Dilarang menggunakan aset, nama, logo, atau brand Trinity Indonesia untuk tujuan komersial, monetisasi langsung, atau kepentingan bisnis tanpa izin tertulis resmi dari pihak pengelola server.' },
			{ num: '5.4', text: 'Pembuatan dan penyebaran konten yang secara sengaja bertujuan untuk mencemarkan nama baik, memfitnah, memprovokasi kebencian, atau merusak reputasi server dan/atau staff akan ditindak secara tegas termasuk kemungkinan tuntutan hukum sesuai dengan UU ITE yang berlaku di Indonesia.' }
		]
	},
	{
		title: 'Pasal 6: Pelanggaran Cyber dan Aktivitas Ilegal',
		content: [
			{ num: '6.1', text: 'Dilarang keras dan mutlak melakukan serangan DDoS (Distributed Denial of Service), DoS (Denial of Service), atau bentuk serangan siber lainnya terhadap infrastruktur server, staff, atau pemain lain. Pelanggaran akan dilaporkan kepada pihak berwenang dan ditindak sesuai hukum yang berlaku termasuk UU ITE.' },
			{ num: '6.2', text: 'Dilarang melakukan hacking, cracking, reverse engineering, atau percobaan akses tidak sah ke sistem server, database, panel admin, atau infrastruktur teknis lainnya.' },
			{ num: '6.3', text: 'Dilarang menyebarkan, mendistribusikan, atau mempromosikan malware, virus, trojan, ransomware, link phishing, atau konten berbahaya lainnya melalui media apapun di dalam ekosistem server.' },
			{ num: '6.4', text: 'Dilarang mengeksploitasi bug, glitch, atau kerentanan sistem untuk merusak server, menduplikasi item (duping), memanipulasi ekonomi, atau mendapatkan keuntungan tidak adil. Pemain yang menemukan bug WAJIB melaporkannya melalui tiket bug report dan dapat menerima reward atas kontribusinya.' },
			{ num: '6.5', text: 'Pelanggaran terhadap pasal ini akan mengakibatkan sanksi ban permanen tanpa peringatan dan laporan resmi kepada Kepolisian Republik Indonesia sesuai dengan UU ITE Pasal 30-36 tentang kejahatan siber.' },
			{ num: '6.6', text: 'Percobaan untuk membantu, memfasilitasi, atau menutup-nutupi aktivitas yang melanggar pasal ini oleh pihak lain juga merupakan pelanggaran dan akan dikenakan sanksi yang setara.' }
		]
	},
	{
		title: 'Pasal 7: Promosi dan Periklanan',
		content: [
			{ num: '7.1', text: 'Dilarang keras mempromosikan, mengiklankan, atau menyebutkan server Minecraft lain dalam bentuk apapun termasuk melalui chat, sign, book, item name, skin, cape, atau media komunikasi lainnya di dalam server.' },
			{ num: '7.2', text: 'Dilarang mempromosikan situs judi online, pinjaman online ilegal, skema ponzi, MLM, atau aktivitas ilegal/semi-legal lainnya. Sanksi: ban permanen tanpa peringatan dan kemungkinan laporan ke pihak berwajib.' },
			{ num: '7.3', text: 'Promosi produk, jasa, komunitas, atau kegiatan pribadi hanya diperbolehkan di channel yang secara spesifik ditentukan untuk tujuan tersebut di Discord server, dengan izin dari staff jika diperlukan.' },
			{ num: '7.4', text: 'Spam promosi atau pesan berulang akan dikenakan sanksi bertingkat: mute 24 jam pada pelanggaran pertama, mute 7 hari pada pelanggaran kedua, dan ban permanen pada pelanggaran ketiga atau lebih.' }
		]
	},
	{
		title: 'Pasal 8: Pelaporan, Banding, dan Bantuan',
		content: [
			{ num: '8.1', text: 'Pelaporan pelanggaran aturan oleh pemain lain wajib disertai dengan bukti yang valid, jelas, dan dapat diverifikasi berupa screenshot atau video dengan timestamp yang terlihat. Laporan tanpa bukti yang memadai mungkin tidak dapat diproses.' },
			{ num: '8.2', text: 'Pembuatan laporan palsu, fitnah, atau manipulasi bukti dengan tujuan merugikan pemain lain yang tidak bersalah merupakan pelanggaran serius dan akan mengakibatkan sanksi bagi pelapor.' },
			{ num: '8.3', text: 'Tim Staff akan berusaha merespons tiket dan laporan dalam waktu maksimal 48 jam kerja (tidak termasuk hari libur). Response time dapat lebih lama pada periode sibuk.' },
			{ num: '8.4', text: 'Dilarang spam mention, DM berulang, atau mengganggu staff di platform manapun untuk keperluan bantuan. Semua permintaan bantuan wajib disampaikan melalui sistem tiket resmi.' },
			{ num: '8.5', text: 'Kritik, saran, dan masukan konstruktif sangat dihargai dan diterima melalui channel yang ditentukan selama disampaikan dengan sopan, tidak bersifat menyerang pribadi, dan bertujuan membangun.' }
		]
	}
]

const modeRules = {
	oneblock: [
		{
			title: 'Aturan Anti-Cheat OneBlock - WAJIB DIBACA DENGAN SEKSAMA',
			type: 'danger',
			content: [
				{ num: 'OB-A1', text: 'SEMUA BENTUK CHEAT, HACK, DAN MODIFIKASI KLIEN ILEGAL DILARANG KERAS TANPA PENGECUALIAN. Hal ini termasuk namun tidak terbatas pada: KillAura, Aimbot, Reach, Velocity, ESP/Wallhack, Fly, Speed, NoFall, Jesus (WaterWalk), AutoArmor, AutoTotem, Scaffold, Nuker, Xray, Freecam, ClickAura, Criticals, Fastbreak, Ghost Hand, dan semua modifikasi sejenis yang memberikan keuntungan tidak adil.' },
				{ num: 'OB-A2', text: 'Dilarang menggunakan macro, auto-clicker, atau software/hardware yang mensimulasikan input otomatis. Butterfly clicking dan drag clicking DIPERBOLEHKAN dengan batas maksimal 20 CPS (Clicks Per Second). Jitter clicking diperbolehkan.' },
				{ num: 'OB-A3', text: 'Dilarang menggunakan texture pack yang memberikan keuntungan tidak adil termasuk: Xray texture pack, fullbright yang memodifikasi lighting engine, texture pack yang membuat entitas/player lebih mudah terlihat (glow effect), atau texture pack yang mengubah ukuran/visibilitas hitbox.' },
				{ num: 'OB-A4', text: 'Mod yang DIPERBOLEHKAN: OptiFine/Sodium/Iris (shader dan optimization), Minimap (TANPA cave finder dan entity radar), Armor/Status HUD, Schematica (TANPA printer mode), Replay Mod, Litematica (TANPA easy place), dan mod kosmetik murni seperti capes mod.' },
				{ num: 'OB-A5', text: 'Mod/Client yang DILARANG: Badlion Client dengan fitur unfair enabled, Lunar Client dengan illegal modules, Wurst, Impact, Future, Aristois, Meteor, Inertia, dan SEMUA hack client atau utility mod dengan fitur cheat.' },
				{ num: 'OB-A6', text: 'SANKSI PELANGGARAN CHEAT: Pelanggaran pertama = Ban 30 hari tanpa negosiasi. Pelanggaran kedua = Ban Permanen. Tidak ada toleransi, pengurangan sanksi, atau kesempatan kedua setelah ban permanen.' }
			]
		},
		{
			title: 'Aturan Anti-Toxic dan Perilaku OneBlock',
			type: 'danger',
			content: [
				{ num: 'OB-B1', text: 'TOXIC BEHAVIOR DALAM SEGALA BENTUK DILARANG KERAS. Ini mencakup penggunaan kata-kata kasar, makian, hinaan pribadi, body shaming, atau bahasa yang menyinggung SARA (Suku, Agama, Ras, Antar-golongan) baik secara eksplisit maupun tersirat.' },
				{ num: 'OB-B2', text: 'Dilarang melakukan bullying, harassment, intimidasi, stalking, atau target harassment terhadap pemain lain dalam bentuk apapun baik di dalam game, Discord, maupun platform terkait lainnya.' },
				{ num: 'OB-B3', text: 'Dilarang spam chat (mengirim pesan yang sama/mirip berulang-ulang), flood chat (karakter atau pesan random), excessive caps lock (MENULIS DENGAN HURUF BESAR TERUS MENERUS), atau character spam.' },
				{ num: 'OB-B4', text: 'Dilarang membahas topik sensitif dan kontroversial seperti politik praktis, debat agama, isu SARA, atau topik lain yang berpotensi memicu konflik, perpecahan, atau ketidaknyamanan dalam komunitas.' },
				{ num: 'OB-B5', text: 'Dilarang keras membuat, mendistribusikan, atau menampilkan konten NSFW/dewasa dalam bentuk apapun termasuk melalui chat, build struktur, skin karakter, item name, book, sign, atau media lainnya.' },
				{ num: 'OB-B6', text: 'SANKSI TOXIC: Mute 1 jam hingga 7 hari tergantung tingkat keparahan dan konteks. Pelanggaran berulang atau kasus berat dapat berujung pada ban temporary hingga permanent.' }
			]
		},
		{
			title: 'Aturan PvP dan Interaksi Pemain OneBlock',
			type: 'info',
			content: [
				{ num: 'OB-C1', text: 'PvP (Player vs Player) hanya diperbolehkan dan legal di area yang secara resmi ditandai dan didesain sebagai zona PvP, atau dengan persetujuan eksplisit dan jelas dari kedua belah pihak yang terlibat.' },
				{ num: 'OB-C2', text: 'Dilarang keras melakukan spawn killing, spawn camping, atau menunggu di dekat spawn point untuk membunuh pemain yang baru spawn atau respawn.' },
				{ num: 'OB-C3', text: 'Combat logging (disconnect/quit saat sedang dalam pertarungan PvP untuk menghindari kematian) akan mengakibatkan sistem mencatat kematian dan kehilangan item secara otomatis.' },
				{ num: 'OB-C4', text: 'Dilarang memanfaatkan bug, glitch, atau eksploit untuk mendapatkan keuntungan dalam pertarungan PvP termasuk namun tidak terbatas pada ping abuse, block glitching, atau pearl glitching.' },
				{ num: 'OB-C5', text: 'Trash talk ringan dan banter dalam konteks kompetisi yang sehat masih diperbolehkan, namun tidak boleh melampaui batas kesopanan yang ditentukan dalam aturan toxic behavior.' }
			]
		},
		{
			title: 'Aturan Trading dan Ekonomi OneBlock',
			type: 'info',
			content: [
				{ num: 'OB-D1', text: 'Scamming atau penipuan dalam bentuk apapun DILARANG KERAS. Selalu dokumentasikan setiap trading dengan screenshot sebagai bukti. Trading dilakukan dengan risiko masing-masing jika tidak ada bukti.' },
				{ num: 'OB-D2', text: 'Trading item atau mata uang in-game dengan uang nyata (RMT) di luar sistem resmi bukan tanggung jawab server. Lakukan dengan risiko sendiri.' },
				{ num: 'OB-D3', text: 'Mengeksploitasi bug ekonomi, duplication glitch, atau celah sistem untuk mendapatkan item/uang secara tidak sah adalah DILARANG. Pelaku akan di-ban dan seluruh aset hasil eksploitasi akan dihapus.' },
				{ num: 'OB-D4', text: 'SANKSI SCAM: Pengembalian item korban (jika memungkinkan) + Ban 14 hari untuk pelanggaran pertama. Ban Permanen untuk pelanggaran kedua.' }
			]
		}
	],
	boxsmp: [
		{
			title: 'Aturan Anti-Cheat BoxSMP - IDENTIK DENGAN ONEBLOCK',
			type: 'danger',
			content: [
				{ num: 'BS-A1', text: 'Semua aturan anti-cheat yang berlaku di mode OneBlock (OB-A1 sampai OB-A6) BERLAKU SEPENUHNYA di mode BoxSMP tanpa modifikasi atau pengecualian.' },
				{ num: 'BS-A2', text: 'Referensi lengkap: lihat bagian "Aturan Anti-Cheat OneBlock" untuk daftar lengkap mod yang dilarang dan diperbolehkan.' },
				{ num: 'BS-A3', text: 'SANKSI: Identik dengan OneBlock - Ban 30 hari untuk pelanggaran pertama, Ban Permanen untuk pelanggaran kedua.' }
			]
		},
		{
			title: 'Aturan Anti-Toxic, Anti-Griefing, dan Anti-Stealing BoxSMP',
			type: 'danger',
			content: [
				{ num: 'BS-B1', text: 'Semua aturan anti-toxic dari OneBlock (OB-B1 sampai OB-B6) BERLAKU SEPENUHNYA di BoxSMP.' },
				{ num: 'BS-B2', text: 'GRIEFING DILARANG KERAS. Griefing didefinisikan sebagai: merusak, menghancurkan, mengubah, atau memodifikasi bangunan/struktur/area milik pemain lain tanpa izin eksplisit dari pemilik.' },
				{ num: 'BS-B3', text: 'STEALING DILARANG KERAS. Mencuri item dari container (chest, barrel, shulker box, hopper, dll) milik pemain lain adalah pelanggaran meskipun area tersebut tidak di-claim atau tidak terkunci.' },
				{ num: 'BS-B4', text: 'Dilarang membunuh, melukai, atau mencuri hewan ternak, pet, atau mob yang sudah di-name tag milik pemain lain.' },
				{ num: 'BS-B5', text: 'Dilarang membuat trap berbahaya, lava cast, withering, atau struktur yang dapat merusak di area publik, jalur transportasi, atau dalam radius 100 block dari base pemain lain.' },
				{ num: 'BS-B6', text: 'SANKSI GRIEF/STEAL: Rollback area + Ban 7 hari (pertama), Rollback + Ban 30 hari (kedua), Ban Permanen (ketiga atau kasus berat).' }
			]
		},
		{
			title: 'Aturan Claim, Territory, dan Interaksi BoxSMP',
			type: 'info',
			content: [
				{ num: 'BS-C1', text: 'GUNAKAN SISTEM CLAIM untuk melindungi base dan properti. Staff TIDAK AKAN membantu pemulihan atau investigasi untuk properti yang tidak di-claim dengan benar. Claim adalah tanggung jawab pemain.' },
				{ num: 'BS-C2', text: 'Claim blocking (claim tanah strategis di sekitar atau menghalangi akses ke base pemain lain dengan tujuan mengganggu) adalah DILARANG dan akan mengakibatkan penghapusan claim serta kemungkinan sanksi.' },
				{ num: 'BS-C3', text: 'Claim yang tidak menunjukkan aktivitas selama 30 hari berturut-turut dapat dihapus oleh sistem atau staff tanpa pemberitahuan untuk membersihkan server.' },
				{ num: 'BS-C4', text: 'Dispute atau sengketa claim akan diselesaikan berdasarkan bukti claim pertama dengan timestamp dan bukti aktivitas. Keputusan staff bersifat final.' }
			]
		}
	],
	anarchy: [
		{
			title: 'Kebijakan Cheat Mode Anarchy Economy - MODE KHUSUS',
			type: 'warning',
			content: [
				{ num: 'AE-A1', text: 'MODE INI BERBEDA: Penggunaan hack client seperti KillAura, Fly, Speed, Reach, ESP, dan modifikasi gameplay lainnya DIPERBOLEHKAN di mode Anarchy Economy sebagai bagian dari pengalaman anarchy.' },
				{ num: 'AE-A2', text: 'YANG TETAP DILARANG MUTLAK: Exploit yang menyebabkan server crash atau severe lag, lag machine, duplication glitch yang merusak ekonomi server, packet exploit yang mengganggu koneksi pemain lain, atau crash exploit apapun.' },
				{ num: 'AE-A3', text: 'Penggunaan bot atau sistem automation massal yang membebani resources server secara tidak wajar dan mengganggu performa untuk pemain lain tetap DILARANG.' },
				{ num: 'AE-A4', text: 'SANKSI: Pelanggaran AE-A2 dan AE-A3 = Ban Permanen tanpa peringatan, tanpa negosiasi, tanpa banding.' }
			]
		},
		{
			title: 'Kebijakan Toxic dan Chat Mode Anarchy Economy - MODE KHUSUS',
			type: 'warning',
			content: [
				{ num: 'AE-B1', text: 'MODE INI BERBEDA: Trash talk, toxic chat, dan perilaku kompetitif agresif DIPERBOLEHKAN dan merupakan bagian dari pengalaman authentic anarchy gameplay.' },
				{ num: 'AE-B2', text: 'YANG TETAP DILARANG MUTLAK dan tidak akan pernah ditoleransi: Doxxing (menyebarkan informasi pribadi nyata), ancaman kekerasan fisik nyata terhadap pemain atau keluarga mereka, konten CSAM/pedofilia, dan hate speech ekstrem yang menyerukan kekerasan terhadap kelompok tertentu.' },
				{ num: 'AE-B3', text: 'Konten NSFW yang eksplisit dalam bentuk build atau chat yang sangat grafis tetap DILARANG.' },
				{ num: 'AE-B4', text: 'SANKSI: Pelanggaran AE-B2 = Ban Permanen + Laporan ke pihak berwajib (khusus CSAM dan ancaman nyata). Pelanggaran AE-B3 = Ban 7 hari hingga Permanen.' }
			]
		},
		{
			title: 'Gameplay dan Mekanisme Anarchy Economy',
			type: 'info',
			content: [
				{ num: 'AE-C1', text: 'Griefing, raiding, stealing, dan PvP adalah BAGIAN LEGAL dari gameplay mode Anarchy. Tidak ada perlindungan properti di mode ini.' },
				{ num: 'AE-C2', text: 'PvP bebas dan legal di seluruh map kecuali dalam radius spawn protection (100 block dari spawn point utama).' },
				{ num: 'AE-C3', text: 'Server TIDAK BERTANGGUNG JAWAB dan tidak akan memberikan kompensasi atas kehilangan item, base, progress, atau aset apapun di mode ini. Itu adalah risiko yang diterima dengan bermain mode Anarchy.' },
				{ num: 'AE-C4', text: 'Scamming dalam transaksi in-game DIPERBOLEHKAN di mode ini. Trade dan berinteraksi dengan risiko dan pertimbangan sendiri. Trust issues adalah bagian dari gameplay.' },
				{ num: 'AE-C5', text: 'PERINGATAN KERAS: Mode Anarchy Economy bukan untuk semua orang. Jika tidak siap mental untuk menghadapi kemungkinan kehilangan segalanya kapan saja, mainkan mode lain yang lebih protected.' }
			]
		},
		{
			title: 'Batasan Absolut yang Tetap Berlaku di Anarchy',
			type: 'danger',
			content: [
				{ num: 'AE-D1', text: 'DDoS/DoS attack terhadap server atau pemain = Ban Permanen + Laporan Kepolisian RI (UU ITE).' },
				{ num: 'AE-D2', text: 'Hacking, cracking, atau mencuri akun Minecraft pemain lain = Ban Permanen + Laporan Kepolisian RI.' },
				{ num: 'AE-D3', text: 'Penyebaran malware, virus, atau link phishing = Ban Permanen + Laporan Kepolisian RI.' },
				{ num: 'AE-D4', text: 'Server crash exploit atau apapun yang mengganggu stabilitas server = Ban Permanen.' },
				{ num: 'AE-D5', text: 'Promosi judi online, pinjaman ilegal, atau aktivitas kriminal = Ban Permanen.' },
				{ num: 'AE-D6', text: 'Aturan umum server (Pasal 1-8) tetap berlaku di mode Anarchy Economy kecuali yang secara eksplisit dikecualikan dalam aturan mode ini.' }
			]
		}
	]
}

function RuleAccordion({ title, content }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className={`mb-4 rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-white/[0.03] ring-1 ring-rose-500/20' : 'bg-white/[0.02] hover:bg-white/[0.04]'}`}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="w-full p-5 flex items-center gap-4 text-left"
			>
				<div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-rose-500/20 text-rose-400' : 'bg-white/5 text-gray-400'}`}>
					<Icons.Shield className="h-5 w-5" />
				</div>
				<div className="flex-1">
					<h3 className={`font-semibold transition-colors duration-300 ${isOpen ? 'text-rose-100' : 'text-white'}`}>{title}</h3>
				</div>
				<div className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
					<Icons.ChevronDown className={`h-5 w-5 transition-colors duration-300 ${isOpen ? 'text-rose-400' : 'text-gray-500'}`} />
				</div>
			</button>

			<div
				className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
			>
				<div className="overflow-hidden">
					<div className="px-5 pb-5 pt-0">
						<div className="ml-14 space-y-3 border-l border-rose-500/20 pl-4">
							{content.map((item, i) => (
								<div key={i} className="text-gray-300 text-sm leading-relaxed">
									<span className="text-rose-400 font-mono font-semibold mr-2">{item.num}</span>
									{item.text}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function ModeRuleCard({ title, type, content }) {
	const [isOpen, setIsOpen] = useState(false);
	const typeColors = {
		danger: { ring: 'ring-red-500/20', icon: 'bg-red-500/20 text-red-400', text: 'text-red-400', chevron: 'text-red-400' },
		warning: { ring: 'ring-yellow-500/20', icon: 'bg-yellow-500/20 text-yellow-400', text: 'text-yellow-400', chevron: 'text-yellow-400' },
		info: { ring: 'ring-blue-500/20', icon: 'bg-blue-500/20 text-blue-400', text: 'text-blue-400', chevron: 'text-blue-400' }
	};
	const colors = typeColors[type];

	return (
		<div className={`mb-4 rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? `bg-white/[0.03] ring-1 ${colors.ring}` : 'bg-white/[0.02] hover:bg-white/[0.04]'}`}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="w-full p-5 flex items-center gap-4 text-left"
			>
				<div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${isOpen ? colors.icon : 'bg-white/5 text-gray-400'}`}>
					<Icons.Shield className="h-5 w-5" />
				</div>
				<div className="flex-1">
					<h3 className={`font-semibold transition-colors duration-300 ${isOpen ? 'text-white' : 'text-white'}`}>{title}</h3>
				</div>
				<div className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
					<Icons.ChevronDown className={`h-5 w-5 transition-colors duration-300 ${isOpen ? colors.chevron : 'text-gray-500'}`} />
				</div>
			</button>

			<div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
				<div className="overflow-hidden">
					<div className="px-5 pb-5 pt-0">
						<div className={`ml-14 space-y-3 border-l pl-4 ${type === 'danger' ? 'border-red-500/20' : type === 'warning' ? 'border-yellow-500/20' : 'border-blue-500/20'}`}>
							{content.map((item, i) => (
								<div key={i} className="text-gray-300 text-sm leading-relaxed">
									<span className={`font-mono font-semibold mr-2 ${colors.text}`}>{item.num}</span>
									{item.text}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function Rules() {
	const [toastVisible, setToastVisible] = useState(false);
	const [toastMsg, setToastMsg] = useState('');
	const [activeTab, setActiveTab] = useState(0);

	function toast(msg, d = 2000) { setToastMsg(msg); setToastVisible(true); setTimeout(() => setToastVisible(false), d); }
	function copyIpAddress(e) { e.preventDefault(); if (typeof window !== "undefined") navigator.clipboard.writeText(config.serverIpAddress); toast('IP server berhasil disalin!'); }

	return (
		<Wrapper seo={{ title: 'Aturan Server' }}>
			<div className={`${toastVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} fixed right-5 bottom-5 z-50 glass-card px-6 py-4 rounded-2xl shadow-2xl transition-all duration-300`}>
				<p className="text-white font-semibold">{toastMsg}</p>
			</div>

			{/* Hero */}
			<section className="relative min-h-[50vh] flex items-center overflow-hidden pt-24">
				<div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/vendor/bg.webp")' }} />
				<div className="absolute inset-0 hero-gradient" />
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div className="particle particle-1" /><div className="particle particle-2" /><div className="particle particle-3" />
				</div>

				<div className="container relative z-10">
					<div className="max-w-3xl">
						<span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-6">Aturan Server</span>
						<h1 className="text-4xl md:text-6xl font-black text-white uppercase mb-6">Panduan <span className="gradient-text">Bermain</span></h1>
						<p className="text-lg text-gray-300 mb-8">Setiap mode memiliki aturan berbeda. Baca dengan teliti sebelum bermain!</p>
						<button onClick={copyIpAddress} className="glow-button font-bold uppercase py-4 px-8 rounded-2xl flex items-center gap-3 text-white">
							<Icons.ClipboardCopy className="h-5 w-5" />
							{config.serverIpAddress}
						</button>
					</div>
				</div>
			</section>

			{/* Comparison */}
			<section className="py-16" style={{ background: 'var(--surface-800)' }}>
				<div className="container">
					<div className="text-center mb-12">
						<h2 className="text-2xl font-bold text-white mb-2">Perbandingan Cepat</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{Object.entries(modeInfo).map(([key, mode]) => (
							<div key={key} className="glass-card p-6 rounded-2xl text-center">
								<div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${mode.gradient} text-white mb-4`}>
									<Icons.Cube className="h-6 w-6" />
								</div>
								<h3 className="text-xl font-bold text-white mb-2">{mode.name}</h3>
								<p className="text-gray-400 text-sm mb-4">{mode.description}</p>
								<div className="space-y-2">
									<div className="flex justify-between items-center py-2 border-t border-white/5">
										<span className="text-gray-400 text-sm">Cheat</span>
										<span className={`text-sm font-bold ${mode.cheatPolicy === 'DILARANG' ? 'text-red-400' : 'text-yellow-400'}`}>{mode.cheatPolicy}</span>
									</div>
									<div className="flex justify-between items-center py-2 border-t border-white/5">
										<span className="text-gray-400 text-sm">Toxic</span>
										<span className={`text-sm font-bold ${mode.toxicPolicy === 'DILARANG' ? 'text-red-400' : 'text-yellow-400'}`}>{mode.toxicPolicy}</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Mode Rules */}
			<section className="py-24" style={{ background: 'var(--surface-900)' }}>
				<div className="container">
					<div className="text-center mb-12">
						<span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-6">Aturan Per Mode</span>
						<h2 className="text-4xl font-black uppercase text-white mb-4">Pilih Mode</h2>
					</div>

					<Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
						<Tab.List className="flex flex-wrap justify-center gap-4 mb-12">
							{Object.entries(modeInfo).map(([key, mode]) => (
								<Tab key={key} className={({ selected }) => `px-6 py-3 rounded-xl font-bold uppercase transition-all duration-300 flex items-center gap-2 ${selected ? `bg-gradient-to-r ${mode.gradient} text-white shadow-lg` : 'glass text-gray-400 hover:text-white'}`}>
									<Icons.Cube className="h-5 w-5" />
									{mode.name}
								</Tab>
							))}
						</Tab.List>

						<Tab.Panels>
							{Object.entries(modeRules).map(([key, rules]) => (
								<Tab.Panel key={key} className="max-w-4xl mx-auto">
									{rules.map((rule, i) => <ModeRuleCard key={i} {...rule} />)}
								</Tab.Panel>
							))}
						</Tab.Panels>
					</Tab.Group>
				</div>
			</section>

			{/* General Rules */}
			<section className="py-24" style={{ background: 'var(--surface-800)' }}>
				<div className="container">
					<div className="text-center mb-12">
						<span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-6">Berlaku di Semua Mode</span>
						<h2 className="text-4xl font-black uppercase text-white mb-4">Aturan Umum</h2>
						<p className="text-gray-400 max-w-2xl mx-auto">8 Pasal aturan yang berlaku di semua game mode tanpa pengecualian</p>
					</div>

					<div className="max-w-4xl mx-auto">
						{generalRules.map((rule, i) => <RuleAccordion key={i} {...rule} />)}
					</div>
				</div>
			</section>
		</Wrapper>
	)
}
