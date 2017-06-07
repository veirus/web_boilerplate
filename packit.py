#!/usr/bin/env python3
import os
import zipfile
def printProgressBar (iteration, total, prefix = '', suffix = '', decimals = 0, length = 100, fill = '█', span = ' '):
	"""
	Call in a loop to create terminal progress bar
	@params:
		iteration   - Required  : current iteration (Int)
		total       - Required  : total iterations (Int)
		prefix      - Optional  : prefix string (Str)
		suffix      - Optional  : suffix string (Str)
		decimals    - Optional  : positive number of decimals in percent complete (Int)
		length      - Optional  : character length of bar (Int)
		fill        - Optional  : bar fill character (Str)
	"""
	propeller = '-\|/'[iteration%4]
	percent = ("{0:." + str(decimals) + "f}").format(100 * (iteration / float(total)))
	filledLength = int(length * iteration // total)
	bar = fill * filledLength + span * (length - filledLength)
	print('\r[ %s ] %s [%s] %s%% %s' % (propeller, prefix, bar, percent, suffix), end = '\r')
	# Print New Line on Complete
	if iteration == total:
		print()

def zipdir(path, ziph):
	for root, dirs, files in os.walk(path):
		for fol in dirs:
			if fol in il:
				print('*11* exclude folder:', fol)
				dirs.remove(fol)
		for fil in files:
			l = len(files)
			i = files.index(fil)
			if fname in files:
				# exclude archive name to avoid recursion
				files.remove(fname)
			# pc = int(len(files)*files.index(fil)//20)
			# print('\rZipping folder * %s *\t[%s\t]\t[ %s ]\r' % (fname, '.'*pc, '-\|/'[files.index(fil)%4]), end='\r')
			# include only this folder and not that one above
			absfn = os.path.join(root, fil)
			relfn = absfn[len(path)+len(os.sep):] #XXX: relative path
			ziph.write(absfn, relfn)
			# ziph.write(os.path.join(root, fil))
			printProgressBar(i, l, prefix = 'Zipping * %s *' % fname, suffix = '', length = 16, fill='.')

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

