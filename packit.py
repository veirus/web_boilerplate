#!/usr/bin/env python3
import os
import zipfile

def zipdir(path, ziph):
	# ziph is zipfile handle
	for root, dirs, files in os.walk(path):
		for fol in dirs:
			if fol in il:
				print('*11* exclude folder:', fol)
				dirs.remove(fol)
		for fil in files:
			print('Zipping folder * %s *... [ %s ]' % (fname, '­\|/'[files.index(fil)%4]), end='\r')
			ziph.write(os.path.join(root, fil))

if __name__ == '__main__':
	#use gitignore as exclude list:
	ignorefile = '.gitignore'
	#default ignorelist:
	il = ['lol']
	if os.path.isfile(ignorefile):
		with open(ignorefile, 'r') as ign:
			tmp = ign.readlines()
			it = [i.strip() for i in tmp if not(i.startswith('#')) and not(i.startswith('*')) and i!='\n']
			il.extend(it)
			# check for file patterns too. Currently unused due to complications
			# ifl = [i.strip() for i in tmp if i.startswith('*')]
	# print(il, sep='\n')
	cat = os.getcwd()
	fname = os.path.basename(cat)+'.zip'
	with zipfile.ZipFile(fname, 'w', zipfile.ZIP_DEFLATED) as zipf:
		zipdir(cat, zipf)
		print('\n* Done! *')
