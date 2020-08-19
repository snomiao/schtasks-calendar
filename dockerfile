FROM node
RUN git clone https://github.com/snomiao/schtasks-calendar && cd schtasks-calendar
CMD ["npx", "."]