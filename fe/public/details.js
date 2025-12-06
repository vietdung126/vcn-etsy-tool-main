import moment from 'moment'
import _ from 'lodash'
import { defineStore } from 'pinia'
import service from './service'
import TicketTypeService from '@/services/ticket.type'
import * as paymentService from '@/services/payment'
import { METHOD as PAYMENT_METHOD } from '@/configs/payment'
import { TYPE } from '@/configs/ticket'
import { Promise } from 'bluebird'
import TicketStoreHelper from '@/components/Ticket/stores/_helper'

const mapTypeToApi = {}
Object.values(TYPE).forEach(type => {
  mapTypeToApi[type] = new TicketTypeService(type)
})

const notPaymentTypes = [TYPE.BALANCE_INPUT, TYPE.BALANCE_OUTPUT, null, undefined]
const notPartnerTypes = [TYPE.BALANCE_INPUT, TYPE.BALANCE_OUTPUT, null, undefined]

const useStockDocInOutDetailsStore = defineStore('StockDocInOutDetails', {
  state: () => ({
    _tickets: {},
    // mapLines: {},
    // mapPayments: {},
    // reason: null,
    // _partner: null,
  }),
  getters: {
    getById(state) {
      return id => id && state._tickets[id]
    },
    partner(state) {
      return ticketId => ticketId && state._tickets[ticketId]?.partner
    },
    notPartner: state => ticketId => notPartnerTypes.includes(state._tickets[ticketId]?.type),
    notPayment: state => ticketId => notPaymentTypes.includes(state._tickets[ticketId]?.type),
    lines: state => ticketId => {
      const items = Object.values(state._tickets[ticketId]._lines)
      items.sort((a, b) => (a.no - b.no ? -1 : 1))
      return items
    },
    payments: state => ticketId => {
      const items = Object.values(state._tickets[ticketId]?._payments || {})
      items.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
      return items
    },
    totalUnits: state => ticketId => {
      const lines = Object.values(state._tickets[ticketId]?.lines || {})
      const total = lines.reduce((prev, curr) => curr.units + prev, 0)
      return total
    },
    totalMoney: state => ticketId => {
      const lines = Object.values(state._tickets[ticketId]?._lines || {})
      const total = lines.reduce((prev, curr) => curr.units * curr.price + prev, 0)
      return total
    },
    totalMoneyPaid: state => {
      const payments = Object.values(state.mapPayments)
      const totalPaid = payments.reduce((prev, curr) => curr.value + prev, 0)
      return totalPaid
      // },
      // refund: state => {
      //   return getRefund(state.mapPayments, state.mapLines)
      // },
    },
    actions: {
      async loadTicket(ticketId) {
        const ticket = await service.getById(ticketId)
        this.setTicket(ticket)
      },
      /**
       * Set current ticket & load lines of ticket
       * @param {object} ticket
       */
      async setTicket(ticket) {
        if (!ticket) {
          return
        }

        await TicketStoreHelper.fillTicket(ticket)
        const item = {
          ticket,
          method: paymentService.getDefaultReasonByTicketType(ticket.type),
          reason: paymentService.getDefaultReasonByTicketType(ticket.type),
        }

        this._tickets[ticket.id] = item
        await Promise.all([this.loadLines(ticket.id), this.loadPayments(ticket.id)])
      },
      async loadLines(ticketId) {
        const ticket = ticketId && this._tickets[ticketId]

        if (!ticket) {
          return
        }
        ticket._lines = {}
        const lines = await service.getLines(ticket.id)
        await TicketStoreHelper.fillLine(...lines)
        ticket._lines = _.keyBy(lines, 'no')

        return lines
      },
      async loadPayments(ticketId) {
        const ticket = ticketId && this._tickets[ticketId]

        if (!ticket) {
          return
        }

        if (
          [TYPE.BALANCE_INPUT, TYPE.BALANCE_OUTPUT, TYPE.TRANSFER_IN, TYPE.TRANSFER_OUT].includes(
            ticket.type,
          )
        ) {
          return
        }

        ticket._payments = {}
        const payments = await service.getPayments(ticket.id)
        this._payments = _.keyBy(payments, 'id')

        return payments
      },
      async updateStore(ticketId, storeId) {
        const ticket = ticketId && this._tickets[ticketId]

        if (!ticket) {
          return
        }
        const newTicket = await service.updateStore(this._ticket.id, storeId)
        await TicketStoreHelper.fillTicket(newTicket)
        ticket.ticket = newTicket
      },
      async addLine(ticketId, productId, setInstanceId, units) {
        const ticket = ticketId && this._tickets[ticketId]

        if (!ticket) {
          return
        }

        const line = await service.addLine(ticket.id, productId, setInstanceId, units)
        await TicketStoreHelper.fillLine(line)

        ticket._lines[line.no] = line
      },

      async updateLineUnits(ticketId, no, units) {
        const ticket = ticketId && this._tickets[ticketId]

        if (!ticket) {
          return
        }

        const newUnits = Number(units)
        const currentLine = ticket._lines[no]

        if (newUnits == currentLine.units) {
          return currentLine
        }

        const line = await service.updateLineUnits(ticket.id, no, newUnits)
        await TicketStoreHelper.fillLine(line)
        ticket._lines[line.no] = line

        return line
      },

      async updateLinePrice(ticketId, no, price) {
        const ticket = ticketId && this._tickets[ticketId]

        if (!ticket) {
          return
        }

        const newPrice = Number(price)
        const currentLine = this.mapLines[no]

        if (newPrice == currentLine.price) {
          return currentLine
        }

        const line = await service.updateLinePrice(this._ticket.id, no, newPrice)
        await TicketStoreHelper.fillLine(line)
        ticket._lines[line.no] = line

        return line
      },

      async deleteLine(ticketId, lineNo) {
        const ticket = ticketId && this._tickets[ticketId]

        if (!ticket) {
          return
        }

        await service.deleteLine(ticket.id, lineNo)
        delete ticket._lines[lineNo]
      },

      async addPayment(
        ticketId,
        {
          date,
          time,
          method = PAYMENT_METHOD.CASH,
          reason = paymentService.getDefaultReasonByTicketType(this._ticket?.type),
          value = 0,
          note,
          cashDetails,
        },
      ) {
        const ticket = ticketId && this._tickets[ticketId]

        if (!ticket) {
          return
        }

        const now = moment()
        const payment = await service.addPayment(ticket.id, {
          date: date || now.format('YYYY-MM-DD'),
          time: time || now.format('HH:mm:ss'),
          method,
          reason,
          value,
          note,
          cashDetails,
        })

        ticket._payments[payment.id] = payment
        return payment
      },

      async updatePaymentValue(ticketId, paymentId, value) {
        const ticket = ticketId && this._tickets[ticketId]

        if (!ticket) {
          return
        }

        const newValue = Number(value)
        const currentPayment = this._payments[paymentId]

        if (newValue == currentPayment.value) {
          return currentPayment
        }

        const payment = await service.updatePayment(this._ticket.id, paymentId, { value: newValue })

        ticket._payments[payment.id] = payment
        return payment
      },

      async updatePaymentMethod(ticketId, paymentId, method) {
        const ticket = ticketId && this._tickets[ticketId]

        if (!ticket) {
          return
        }

        const newMethod = Number(method)
        const currentPayment = ticket._payments[paymentId]

        if (newMethod == currentPayment.method) {
          return currentPayment
        }

        const payment = await service.updatePayment(this._ticket.id, paymentId, {
          method: newMethod,
        })

        ticket._payments[payment.id] = payment
        return payment
      },

      async deletePayment(paymentId) {
        const api = mapTypeToApi[this._ticket.type]
        await api.deletePayment(this._ticket.id, paymentId)
        delete this.mapPayments[paymentId]

        return
      },

      async updatePartner(ticketId, partnerId) {
        const ticket = ticketId && this._tickets[ticketId]

        if (!ticket) {
          return
        }

        const newTicket = await service.updatePartner(this._ticket.id, partnerId)
        await TicketStoreHelper.fillTicket(newTicket)
        ticket.ticket = newTicket

        return ticket
      },

      async close(ticketId) {
        const ticket = ticketId && this._tickets[ticketId]

        if (!ticket) {
          return
        }

        await service.close(ticket.id, getRefund(ticket._payments, ticket._lines))

        delete this._tickets[ticketId]
      },

      async delete(ticketId) {
        const ticket = ticketId && this._tickets[ticketId]

        if (!ticket) {
          return
        }

        await service.delete(ticket.id)
        delete this._tickets[ticketId]
      },

      clear() {
        this._ticket = null
        this.mapLines = {}
        this.mapPayments = {}
        this.reason = null
        this._partner = null
      },
    },
  },
})

export { useStockDocInOutDetailsStore }

function getRefund(mapPayments, mapLines) {
  const payments = Object.values(mapPayments)
  const totalMoneyPaid = payments.reduce((prev, curr) => curr.value + prev, 0)
  const lines = Object.values(mapLines)
  const totalMoneyGoods = lines.reduce((prev, curr) => curr.units * curr.price + prev, 0)
  return totalMoneyPaid - totalMoneyGoods
}
